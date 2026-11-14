import type { Mission } from '../types';

export const NASA_MISSIONS: Mission[] = [
    {
        id: 'bionutrients',
        code: 'BIONUTRIENTS-2',
        smdDivision: 'BPS',
        smdLabel: 'Biological & Physical Sciences (ISS)',
        name: 'BioNutrients-2: In-Space Nutrient Production on ISS',
        orbitLabel: 'Low Earth Orbit (ISS / LEO, 1.0 AU)',
        au: 1.0,
        budgetLimit: 86,
        maxVolumeUnit: 300,
        volUnitLabel: 'mL (limit <300 mL)',
        radHazard: 15,
        wavelengthReq: 'BIO_LAB',
        wavelengthLabel: 'Bio-Incubation (30°C) + MELFI Cryo-Freezing',
        needStatement: 'Foods and supplements stored long-term, such as on human missions to Mars, experience nutrient degradation. We need rapid, safe, and reliable in-place production of dietary nutrients using minimal mass, power, and volume.',
        goalsList: [
            'Enable growth of genetically-modified yeast organisms (>= 12 replicate samples, >= 30 mL each)',
            'Produce targeted beta-carotene (>= 3 ug/mL) on the ISS with zero microbial contamination',
            'Reduce mass (< 250 g sample container) and total volume (< 300 mL) compared to BioNutrients-1'
        ],
        requiredPayloads: ['fep_packs', 'incubator_melfi'],
        realComparison: "In NASA's real BioNutrients-2 mission (Pages 11–23 of Julie Levri's NASA presentation), Fluorinated Ethylene Propylene (FEP) production bags were launched soft-stowed at ambient temperature aboard NG-18 Cygnus to the ISS. Crew-5 astronauts hydrated the yeast spores via syringe, shook for 1 minute, incubated at 30°C, and froze samples in MELFI for return to Earth, thawing, centrifugation, and spectrophotometric analysis.",
        officeHoursHint: 'For BioNutrients-2, select NG-18 Cygnus Cargo (Launch), ISS Orbital Rendezvous & Return, Bio-FEP Container (<250g) + FEP Production Packs + Incubator/MELFI (Space), ISS Payload Operations Center (Ground), and Bio-Lab Thaw & Centrifuge (User). Keep total volume <= 300 mL!',
        optimalPreset: {
            launchId: 'ng18_cygnus',
            propulsionId: 'leo_iss_transfer',
            powerId: 'iss_bus_pwr',
            busId: 'bio_fep_container',
            payloads: ['fep_packs', 'incubator_melfi'],
            groundId: 'iss_payload_ops',
            userId: 'user_centrifuge'
        },
        conopsEvent: {
            title: 'T+6 Hours Post-Hydration Aboard ISS (Crew-5 Operations)',
            desc: 'ISS astronauts report that 6 hours have elapsed since sterile water was injected into the FEP production bags containing yeast spores. Per the BioNutrients-2 ConOps protocol (PDF Page 16), select the Ground Control directive:',
            opt1Title: 'AGITATE PRODUCTION BAGS (SHAKE 1 MIN) & RETURN TO 30°C INCUBATOR',
            opt1Desc: 'Ensures uniform media mixing and maximum beta-carotene yield (>=3 ug/mL) prior to MELFI freezing.',
            opt2Title: 'IMMEDIATELY TRANSFER TO MELFI FREEZER (-80°C)',
            opt2Desc: 'Eliminates thermal drift risk, but halts yeast cell growth prematurely (-25% beta-carotene yield).'
        }
    },
    {
        id: 'punch',
        code: 'PUNCH-CONSTELLATION',
        smdDivision: 'HELIO',
        smdLabel: 'Heliophysics (SmallSat / CubeSat Fleet)',
        name: 'PUNCH: Polarimeter to Unify the Corona & Heliosphere',
        orbitLabel: 'Sun-Synchronous Low Earth Orbit (LEO Terminator, 1.0 AU)',
        au: 1.0,
        budgetLimit: 209,
        maxVolumeUnit: 24,
        volUnitLabel: 'U-units (max 24U for 4 SmallSats)',
        radHazard: 35,
        wavelengthReq: 'UV_POLAR',
        wavelengthLabel: 'Visible & UV Polarimetric Tomography',
        needStatement: "How do mass and energy from the Sun's corona become the solar wind that fills the solar system? Answering this requires global, continuous 3D observations from low Earth orbit.",
        goalsList: [
            'Deploy a synchronized constellation of 4 small satellites into a sun-synchronous terminator orbit',
            'Combine 1 Narrow Field Imager (NFI coronagraph) with 3 Wide Field Imagers (WFI polarimeters)',
            'Maintain strict SmallSat/CubeSat 101 form-factor constraints (<= 24U total constellation volume)'
        ],
        requiredPayloads: ['coronagraph_nfi', 'polarimeter_wfi'],
        realComparison: "NASA's PUNCH mission (Page 24 of the NASA webinar) uses a constellation of four small satellites in Sun-synchronous low Earth orbit to make global, 3D polarimetric observations of the Sun's corona transitioning into the young solar wind.",
        officeHoursHint: 'For PUNCH, select Falcon 9 SmallSat RideShare (Launch), 4-Satellite SSO Terminator Phasing, Standard GaAs Solar Arrays, the 4x6U SmallSat Constellation Bus, and both polarimetric instruments (NFI Coronagraph + WFI Polarimeters). In the User Segment, select 3D Heliospheric Tomography!',
        optimalPreset: {
            launchId: 'f9_rideshare',
            propulsionId: 'leo_sso_deploy',
            powerId: 'solar_std',
            busId: 'cubesat_4x6u',
            payloads: ['coronagraph_nfi', 'polarimeter_wfi'],
            groundId: 'nsn_sband',
            userId: 'user_tomography'
        },
        conopsEvent: {
            title: 'Coronal Mass Ejection (CME) Alert Across All 4 PUNCH Satellites',
            desc: 'A fast halo Coronal Mass Ejection has erupted from the Sun toward Earth. This is prime science opportunity, but high proton flux could saturate the CCD polarimeter detectors!',
            opt1Title: 'EXECUTE SYNCHRONIZED 3D POLARIMETRIC CADENCE',
            opt1Desc: 'Maintain continuous imaging across all 4 satellites to reconstruct the 3D CME shockfront (requires >=35% radiation shielding).',
            opt2Title: 'CLOSE OPTICAL SHUTTERS DURING PEAK PROTON FLUX',
            opt2Desc: 'Guarantees zero sensor degradation, but misses the core CME acceleration phase (-20% science return).'
        }
    },
    {
        id: 'dawn',
        code: 'DAWN-ASTEROID-HOP',
        smdDivision: 'PLANET',
        smdLabel: 'Planetary Science (Main Asteroid Belt)',
        name: 'Dawn: Rendezvous & Orbit of Both Vesta and Ceres',
        orbitLabel: 'Main Asteroid Belt (2.8 AU from Sun)',
        au: 2.8,
        budgetLimit: 447,
        maxVolumeUnit: 1200,
        volUnitLabel: 'Liters (payload bay volume)',
        radHazard: 50,
        wavelengthReq: 'VIS_IR_GAMMA',
        wavelengthLabel: 'Optical Framing + VIR Spectrometer + Gamma/Neutron',
        needStatement: 'To explore the pristine environment in which planets formed, we must design the first spacecraft capable of orbiting two distinct extraterrestrial bodies in the main belt: rocky protoplanet Vesta and icy dwarf planet Ceres.',
        goalsList: [
            'Provide massive Delta-V (~11 km/s) to orbit Vesta, escape, and enter orbit around Ceres (Xenon Ion Propulsion!)',
            'Compensate for inverse-square solar flux drop at 2.8 AU (only ~13% of Earth solar irradiance)',
            'Map surface mineralogy, topography, and elemental hydrogen/iron abundance'
        ],
        requiredPayloads: ['framing_cam', 'grond_spec'],
        realComparison: "NASA's Dawn mission (Page 24 of the NASA webinar) was the first spacecraft to orbit two small bodies, asteroid Vesta and dwarf planet Ceres. This feat was only possible thanks to Solar Electric Propulsion (NSTAR xenon ion thrusters) and large Dutch solar arrays.",
        officeHoursHint: 'Conventional chemical rockets cannot orbit Vesta and then transfer to Ceres! You must select the NSTAR Xenon Ion Engine (SEP Spiral), Large ROSA/Dutch Solar Wings to generate enough power at 2.8 AU, Composite Interplanetary Bus, Framing Camera + VIR, GRaND Spectrometer, and the DSN 34m X-Band network.',
        optimalPreset: {
            launchId: 'vulcan_vc4',
            propulsionId: 'ion_sep_spiral',
            powerId: 'solar_rosa',
            busId: 'bus_composite',
            payloads: ['framing_cam', 'grond_spec'],
            groundId: 'dsn_xband',
            userId: 'user_gis_mapping'
        },
        conopsEvent: {
            title: 'Vesta-to-Ceres Spiral Transfer: GMAT Low-Thrust Ion Operations',
            desc: 'After completing Vesta mapping, the spacecraft is spiraling outward toward Ceres (2.8 AU). One reaction wheel shows elevated friction during low-thrust ion firing.',
            opt1Title: 'GIMBAL XENON ION THRUSTER FOR HYBRID ATTITUDE CONTROL',
            opt1Desc: 'Use the ion thruster two-axis gimbal to offload reaction wheels, conserving hydrazine for low-altitude Ceres mapping.',
            opt2Title: 'RAISE CERES MAPPING ORBIT ALTITUDE (SKIP LOW HAMO)',
            opt2Desc: 'Reduces attitude control demand, but lowers GRaND neutron spectrometer spatial resolution (-15% science).'
        }
    },
    {
        id: 'europa',
        code: 'EUROPA-CLIPPER-SLS',
        smdDivision: 'PLANET',
        smdLabel: 'Planetary Science (Flagship Outer Planets)',
        name: 'Europa Clipper: Subsurface Ocean & Habitability',
        orbitLabel: 'Jovian System — Europa Flybys (5.2 AU from Sun)',
        au: 5.2,
        budgetLimit: 776,
        maxVolumeUnit: 2500,
        volUnitLabel: 'Liters (fairing payload envelope)',
        radHazard: 90,
        wavelengthReq: 'RADAR_MAG_IR',
        wavelengthLabel: 'VHF Ice Radar + Magnetometry + Thermal IR',
        needStatement: "Beneath Europa's icy crust lies a global saltwater ocean with more water than all of Earth's oceans combined. We must measure ice shell thickness, ocean salinity, and active plumes under extreme Jovian radiation and 3.7% sunlight.",
        goalsList: [
            "Survive Jupiter's intense radiation belts (90% hazard — requires Titanium Radiation Vault)",
            'Maintain positive power balance at 5.2 AU (3.7% solar flux) via Nuclear MMRTG or massive arrays',
            'Leverage heavy-lift NASA SLS to reduce transit time and increase mass/volume margins'
        ],
        requiredPayloads: ['ice_radar_reason', 'mag_icm', 'thermal_ethemis'],
        realComparison: 'Featured on Pages 6 and 24 of the NASA document, Europa Clipper and the heavy-lift Space Launch System (SLS) demonstrate how heavy launch vehicles enable deep-space exploration by reducing mission transit time and increasing mass and payload volume margins.',
        officeHoursHint: 'For Europa, select NASA SLS Block 1B (Launch), Cryogenic Direct Transfer + Flyby, Twin MMRTG Nuclear Generators, the Titanium Radiation Vault (92% shielding), all three ocean-probing instruments (REASON Ice Radar, Magnetometer, E-THEMIS Thermal IR), and the 70m Ka-Band Deep Space Network!',
        optimalPreset: {
            launchId: 'nasa_sls',
            propulsionId: 'direct_high_energy',
            powerId: 'rtg_mmrtg',
            busId: 'bus_titanium_vault',
            payloads: ['ice_radar_reason', 'mag_icm', 'thermal_ethemis'],
            groundId: 'dsn_kaband_70m',
            userId: 'user_astrobiology'
        },
        conopsEvent: {
            title: 'Closest Approach Over Europa (25 km Altitude) Inside Jupiter Radiation Belt!',
            desc: 'The spacecraft dives into intense relativistic electron flux to sound the ice shell with the REASON VHF radar. High-energy particles are bombarding the avionics bay!',
            opt1Title: 'FULL-POWER VHF ICE RADAR SOUNDING BEHIND TITANIUM VAULT',
            opt1Desc: 'If equipped with the Titanium Radiation Vault (>=90% shielding), captures 100% of subsurface ocean-ice interface profiles.',
            opt2Title: 'SAFE MODE HIGH-ALTITUDE FLYBY',
            opt2Desc: 'Power down the high-wattage ice radar during closest approach to protect avionics (-20% subsurface ocean data).'
        }
    }
];