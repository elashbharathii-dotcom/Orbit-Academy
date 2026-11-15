/**
 * ORBIT ACADEMY — 6-DOF ORBITAL MECHANICS & AERODYNAMICS ENGINE
 * Stage 09 Realistic Educational Spacecraft Physics Simulator
 */

import {
  SpacecraftFlightState,
  FlightControls,
  MissionDefinition,
  OrbitalElements,
  Vector3D,
} from '../types';

const STANDARD_G0 = 9.80665; // Earth surface gravity acceleration (m/s^2)

// Standard Gravitational Parameters (GM = m^3 / s^2)
const GRAVITATIONAL_PARAMETERS: Record<string, number> = {
  earth: 3.986004418e14,
  moon: 4.9048695e12,
  mars: 4.282837e13,
  iss: 3.986004418e14,
  asteroid: 4.89e3,       // Asteroid Bennu
  'deep-space': 1.32712e20, // Heliocentric
  sun: 1.32712440018e20,
};

export class OrbitalPhysicsEngine {
  /**
   * Initializes spacecraft flight state for a given mission specification
   */
  public static createInitialState(mission: MissionDefinition): SpacecraftFlightState {
    const totalMass = mission.dryMassKg + mission.initialFuelKg + mission.initialMonopropKg;
    const deltaV =
      mission.vacuumIspS *
      STANDARD_G0 *
      Math.log(totalMass / (mission.dryMassKg + mission.initialMonopropKg));

    const initialPos: Vector3D = {
      x: 0,
      y: mission.initialAltitudeM,
      z: 0,
    };

    const initialVel: Vector3D = { ...mission.initialVelocityMs };

    const initialOrbit = this.computeOrbitalElements(
      initialPos,
      initialVel,
      mission.celestialRadiusKm,
      mission.targetBody
    );

    return {
      position: initialPos,
      velocity: initialVel,
      rotation: { x: 0, y: 0, z: 0 },
      angularVelocity: { x: 0, y: 0, z: 0 },

      totalMassKg: totalMass,
      dryMassKg: mission.dryMassKg,
      fuelKg: mission.initialFuelKg,
      maxFuelKg: mission.maxFuelKg,
      monopropKg: mission.initialMonopropKg,
      maxMonopropKg: mission.initialMonopropKg,
      throttle: 0,
      thrustKn: 0,
      specificImpulseS: mission.vacuumIspS,
      deltaVRemainingMs: Math.round(deltaV),
      deltaVExpendedMs: 0,

      altitudeM: mission.initialAltitudeM,
      verticalSpeedMs: initialVel.y,
      horizontalSpeedMs: Math.sqrt(initialVel.x * initialVel.x + initialVel.z * initialVel.z),
      dynamicPressureKPa: 0,
      atmosphericDensity: 0,
      skinTempC: 22,

      gearDeployed: false,
      solarDeployed: false,
      commsDeployed: true,
      sasActive: true,

      flightPhase: mission.initialAltitudeM > 50000 ? 'orbital' : 'ascent',
      elapsedSeconds: 0,
      gForce: 1.0,
      orbital: initialOrbit,

      targetDistanceM: mission.id === 'iss-rendezvous-docking' ? 1200 : undefined,
      relativeVelocityMs: mission.id === 'iss-rendezvous-docking' ? 14 : undefined,
    };
  }

  /**
   * Calculates atmospheric density using the exponential barometric scale height model
   */
  public static getAtmosphericDensity(altitudeM: number, targetBody: string): number {
    if (targetBody === 'moon' || targetBody === 'asteroid' || targetBody === 'deep-space' || targetBody === 'sun') {
      return 0;
    }

    if (targetBody === 'earth' || targetBody === 'iss') {
      if (altitudeM >= 100000) return 0;
      const H = 8500; // Earth scale height: 8.5 km
      const rho0 = 1.225; // Sea level density in kg/m^3
      return rho0 * Math.exp(-altitudeM / H);
    }

    if (targetBody === 'mars') {
      if (altitudeM >= 120000) return 0;
      const H = 11100; // Mars scale height: 11.1 km
      const rho0 = 0.020; // Surface density in kg/m^3
      return rho0 * Math.exp(-altitudeM / H);
    }

    return 0;
  }

  /**
   * Transforms vehicle pitch, yaw, roll into a forward heading thrust vector
   */
  public static getForwardVector(pitchRad: number, yawRad: number, rollRad: number): Vector3D {
    // Standard aerospace rotation: Yaw (Y-axis), Pitch (X-axis), Roll (Z-axis)
    const cosP = Math.cos(pitchRad);
    const sinP = Math.sin(pitchRad);
    const cosY = Math.cos(yawRad);
    const sinY = Math.sin(yawRad);
    const sinR = Math.sin(rollRad);

    return {
      x: sinY * cosP + sinR * sinP * cosY * 0.1,
      y: sinP,
      z: cosY * cosP - sinR * sinP * sinY * 0.1,
    };
  }

  /**
   * Computes Keplerian orbital elements from state vectors
   */
  public static computeOrbitalElements(
    position: Vector3D,
    velocity: Vector3D,
    bodyRadiusKm: number,
    targetBody: string
  ): OrbitalElements {
    const mu = GRAVITATIONAL_PARAMETERS[targetBody] || GRAVITATIONAL_PARAMETERS.earth;
    const bodyRadiusM = bodyRadiusKm * 1000;
    const r = bodyRadiusM + Math.max(0, position.y);
    const vSq = velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z;
    const v = Math.sqrt(vSq);

    // Specific orbital energy
    const epsilon = vSq / 2 - mu / r;

    // Semi-major axis (meters)
    let a = -mu / (2 * (epsilon || -0.00001));
    if (a < 0) a = Math.abs(a); // Hyperbolic handling

    // Orbital eccentricity approximation
    const hAngularMomentum = r * Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
    const eTerm = 1 + (2 * epsilon * hAngularMomentum * hAngularMomentum) / (mu * mu);
    const eccentricity = Math.max(0, Math.sqrt(Math.max(0, eTerm)));

    const apoapsisM = a * (1 + eccentricity);
    const periapsisM = a * Math.max(0, 1 - eccentricity);

    const apoapsisKm = Math.max(0, Math.round((apoapsisM - bodyRadiusM) / 1000));
    const periapsisKm = Math.max(0, Math.round((periapsisM - bodyRadiusM) / 1000));
    const semiMajorAxisKm = Math.round(a / 1000);

    const orbitalPeriodSeconds = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / mu);
    const orbitalPeriodMin = Math.round((orbitalPeriodSeconds / 60) * 10) / 10;

    return {
      apoapsisKm,
      periapsisKm,
      semiMajorAxisKm,
      eccentricity: Math.round(eccentricity * 1000) / 1000,
      inclinationDeg: 28.5,
      orbitalPeriodMin: Math.min(9999, Math.max(1, orbitalPeriodMin)),
      currentVelocityKmS: Math.round((v / 1000) * 100) / 100,
      trueAnomalyDeg: Math.round(((position.x / (r || 1)) * 180) % 360),
    };
  }

  /**
   * Main numerical integration step (Euler-Cromer / RK2 approximation)
   */
  public static stepSimulation(
    currentState: SpacecraftFlightState,
    controls: FlightControls,
    mission: MissionDefinition,
    dt: number
  ): SpacecraftFlightState {
    const state = { ...currentState };
    state.elapsedSeconds += dt;

    // 1. ATTITUDE DYNAMICS (PITCH, YAW, ROLL)
    const rotSpeed = 1.6; // radians / sec^2 authority
    const dampening = controls.sasActive ? 0.92 : 0.99;

    let angAccX = controls.pitch * rotSpeed;
    let angAccY = controls.yaw * rotSpeed;
    let angAccZ = controls.roll * rotSpeed;

    // Apply SAS automatic stability damping when no stick input
    if (controls.sasActive) {
      if (Math.abs(controls.pitch) < 0.05) angAccX -= state.angularVelocity.x * 4.0;
      if (Math.abs(controls.yaw) < 0.05) angAccY -= state.angularVelocity.y * 4.0;
      if (Math.abs(controls.roll) < 0.05) angAccZ -= state.angularVelocity.z * 4.0;
    }

    state.angularVelocity.x = (state.angularVelocity.x + angAccX * dt) * dampening;
    state.angularVelocity.y = (state.angularVelocity.y + angAccY * dt) * dampening;
    state.angularVelocity.z = (state.angularVelocity.z + angAccZ * dt) * dampening;

    state.rotation.x += state.angularVelocity.x * dt;
    state.rotation.y += state.angularVelocity.y * dt;
    state.rotation.z += state.angularVelocity.z * dt;

    // 2. PROPULSION & FUEL FLOW
    let currentThrottle = controls.throttle;
    if (state.fuelKg <= 0) {
      currentThrottle = 0;
    }

    const currentThrustKn = controls.engineIgnited
      ? currentThrottle * mission.maxThrustKn
      : 0;

    const thrustForceN = currentThrustKn * 1000;
    state.throttle = currentThrottle;
    state.thrustKn = Math.round(currentThrustKn * 10) / 10;

    // Propellant mass depletion rate (m_dot = F / (Isp * g0))
    const mDot = thrustForceN / (mission.vacuumIspS * STANDARD_G0);
    const fuelBurnedThisStep = mDot * dt;

    if (fuelBurnedThisStep > 0 && state.fuelKg > 0) {
      state.fuelKg = Math.max(0, state.fuelKg - fuelBurnedThisStep);
      state.totalMassKg = state.dryMassKg + state.fuelKg + state.monopropKg;

      const deltaVBurned = (thrustForceN / state.totalMassKg) * dt;
      state.deltaVExpendedMs += deltaVBurned;
      state.deltaVRemainingMs = Math.max(
        0,
        Math.round(
          mission.vacuumIspS *
            STANDARD_G0 *
            Math.log(state.totalMassKg / (state.dryMassKg + state.monopropKg))
        )
      );
    }

    // RCS Monopropellant consumption on rotation/translation
    const rcsInputMagnitude =
      Math.abs(controls.pitch) +
      Math.abs(controls.yaw) +
      Math.abs(controls.roll) +
      Math.abs(controls.rcsX) +
      Math.abs(controls.rcsY) +
      Math.abs(controls.rcsZ);

    if (rcsInputMagnitude > 0.1 && state.monopropKg > 0) {
      state.monopropKg = Math.max(0, state.monopropKg - 0.45 * dt * rcsInputMagnitude);
    }

    // 3. GRAVITY ACCELERATION
    const mu = GRAVITATIONAL_PARAMETERS[mission.targetBody] || GRAVITATIONAL_PARAMETERS.earth;
    const bodyRadiusM = mission.celestialRadiusKm * 1000;
    const rTotal = Math.max(100, bodyRadiusM + state.position.y);

    const gravAccel = mu / (rTotal * rTotal);
    const gVectorY = -gravAccel;

    // 4. ATMOSPHERIC DRAG & DYNAMIC PRESSURE
    const rho = this.getAtmosphericDensity(state.altitudeM, mission.targetBody);
    state.atmosphericDensity = rho;

    const speedTotal = Math.sqrt(
      state.velocity.x * state.velocity.x +
      state.velocity.y * state.velocity.y +
      state.velocity.z * state.velocity.z
    );

    const qDynamicPressure = 0.5 * rho * speedTotal * speedTotal;
    state.dynamicPressureKPa = Math.round((qDynamicPressure / 1000) * 10) / 10;

    // Drag force vector opposite to velocity
    let dragForceX = 0;
    let dragForceY = 0;
    let dragForceZ = 0;

    if (rho > 0 && speedTotal > 1) {
      const cdA = 4.2; // Cross-sectional aerodynamic drag area (m^2)
      const totalDragN = qDynamicPressure * cdA;
      dragForceX = -totalDragN * (state.velocity.x / speedTotal);
      dragForceY = -totalDragN * (state.velocity.y / speedTotal);
      dragForceZ = -totalDragN * (state.velocity.z / speedTotal);

      // Skin temperature heating
      state.skinTempC = Math.min(
        1650,
        Math.round(22 + (qDynamicPressure / 1000) * 8.5 + (speedTotal / 100) * 12)
      );
    } else {
      state.skinTempC = Math.max(22, state.skinTempC - 2 * dt);
    }

    // 5. THRUST DIRECTION VECTOR
    const thrustDirection = this.getForwardVector(
      state.rotation.x,
      state.rotation.y,
      state.rotation.z
    );

    const thrustForceX = thrustDirection.x * thrustForceN;
    const thrustForceY = thrustDirection.y * thrustForceN;
    const thrustForceZ = thrustDirection.z * thrustForceN;

    // Add RCS translation thrust
    const rcsForceMagN = state.monopropKg > 0 ? 1200 : 0;
    const rcsThrustX = controls.rcsX * rcsForceMagN;
    const rcsThrustY = controls.rcsY * rcsForceMagN;
    const rcsThrustZ = controls.rcsZ * rcsForceMagN;

    // 6. TOTAL ACCELERATION & VELOCITY INTEGRATION
    const totalForceX = thrustForceX + dragForceX + rcsThrustX;
    const totalForceY = thrustForceY + dragForceY + rcsThrustY;
    const totalForceZ = thrustForceZ + dragForceZ + rcsThrustZ;

    const accelX = totalForceX / state.totalMassKg;
    const accelY = totalForceY / state.totalMassKg + gVectorY;
    const accelZ = totalForceZ / state.totalMassKg;

    state.velocity.x += accelX * dt;
    state.velocity.y += accelY * dt;
    state.velocity.z += accelZ * dt;

    state.position.x += state.velocity.x * dt;
    state.position.y += state.velocity.y * dt;
    state.position.z += state.velocity.z * dt;

    state.altitudeM = Math.max(0, state.position.y);
    state.verticalSpeedMs = Math.round(state.velocity.y * 10) / 10;
    state.horizontalSpeedMs =
      Math.round(Math.sqrt(state.velocity.x * state.velocity.x + state.velocity.z * state.velocity.z) * 10) / 10;

    const netAccel = Math.sqrt(accelX * accelX + (accelY - gVectorY) * (accelY - gVectorY) + accelZ * accelZ);
    state.gForce = Math.round((netAccel / STANDARD_G0) * 10) / 10;

    // Subsystems
    state.gearDeployed = controls.gearDeployed;
    state.solarDeployed = controls.solarDeployed;
    state.commsDeployed = controls.commsDeployed;
    state.sasActive = controls.sasActive;

    // 7. ORBITAL TELEMETRY UPDATE
    state.orbital = this.computeOrbitalElements(
      state.position,
      state.velocity,
      mission.celestialRadiusKm,
      mission.targetBody
    );

    // 8. TARGET PROXIMITY TELEMETRY (For ISS Docking or Asteroid)
    if (mission.id === 'iss-rendezvous-docking') {
      const approachSpeed = 12 + state.velocity.z * 0.05;
      const currentDist = Math.max(0, (state.targetDistanceM || 1200) - approachSpeed * dt);
      state.targetDistanceM = Math.round(currentDist * 10) / 10;
      state.relativeVelocityMs = Math.round(Math.abs(approachSpeed) * 10) / 10;

      // Soft Docking Threshold Check
      if (state.targetDistanceM <= 0.8 && state.relativeVelocityMs <= 0.35) {
        state.flightPhase = 'docked';
      }
    }

    // 9. GROUND TOUCHDOWN & IMPACT DETECTION
    if (state.altitudeM <= 0) {
      state.altitudeM = 0;
      state.position.y = 0;

      const touchdownSpeed = Math.abs(state.verticalSpeedMs);
      const isUpright =
        Math.abs(state.rotation.x) < 0.25 && Math.abs(state.rotation.z) < 0.25;

      if (state.gearDeployed && isUpright && touchdownSpeed <= 3.5) {
        // Safe Touchdown!
        state.flightPhase = 'landed';
        state.velocity.x = 0;
        state.velocity.y = 0;
        state.velocity.z = 0;
      } else if (touchdownSpeed > 6.0 || !state.gearDeployed || !isUpright) {
        // High-velocity impact / crash
        state.flightPhase = 'crashed';
        state.velocity.x = 0;
        state.velocity.y = 0;
        state.velocity.z = 0;
      } else {
        // Hard landing but survived
        state.flightPhase = 'landed';
        state.velocity.x = 0;
        state.velocity.y = 0;
        state.velocity.z = 0;
      }
    }

    return state;
  }
}
