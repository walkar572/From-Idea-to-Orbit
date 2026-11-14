import type { SegmentsDB } from '../types';

export const SEGMENTS_DB: SegmentsDB = {
    launchVehicles: [
        {
            id: 'ng18_cygnus',
            name: 'NG-18 Cygnus Cargo (ISS Soft-Stowed)',
            cost: 18,
            maxMass: 60,
            maxVolBonus: 0,
            allowedMissions: ['bionutrients'],
            desc: 'Pressurized cargo delivery to the ISS, soft-stowed at room (ambient) temperature and protected from oxygen and moisture (PDF Pages 14 & 17).'
        },
        {
            id: 'f9_rideshare',
            name: 'Falcon 9 SmallSat RideShare (SSO)',
            cost: 40,
            maxMass: 320,
            maxVolBonus: 0,
            allowedMissions: ['bionutrients', 'punch'],
            desc: 'Cost-effective ESPA-ring deployment for SmallSat and CubeSat constellations into Low Earth or Sun-Synchronous Orbit.'
        },
        {
            id: 'vulcan_vc4',
            name: 'Vulcan Centaur / Medium Interplanetary Launch',
            cost: 115,
            maxMass: 1350,
            maxVolBonus: 0,
            allowedMissions: ['punch', 'dawn', 'europa'],
            desc: 'Medium-heavy interplanetary launcher ideal for injecting solar-electric propulsion probes toward the Asteroid Belt.'
        },
        {
            id: 'nasa_sls',
            name: 'NASA Space Launch System (SLS Block 1B)',
            cost: 240,
            maxMass: 3800,
            maxVolBonus: 500,
            allowedMissions: ['dawn', 'europa'],
            desc: 'Heavy-lift launch vehicle (PDF Page 24) offering reduced deep-space transit time, increased mass margins, and expanded payload volume.'
        }
    ],

    propulsionOptions: [
        {
            id: 'leo_iss_transfer',
            name: 'ISS Orbital Rendezvous & Sample Return Capsule',
            cost: 10,
            mass: 4,
            dvProvided: 0.4,
            timeMonths: 1,
            bestFor: ['bionutrients'],
            desc: 'Automated ISS docking and cold-stowage return of frozen MELFI experiment bags back to Earth scientists.'
        },
        {
            id: 'leo_sso_deploy',
            name: '4-Satellite SSO Terminator Constellation Phasing',
            cost: 18,
            mass: 28,
            dvProvided: 1.2,
            timeMonths: 3,
            bestFor: ['punch'],
            desc: 'Precisely phases 4 SmallSats along the day/night terminator orbit for continuous 3D solar corona coverage.'
        },
        {
            id: 'ion_sep_spiral',
            name: 'NSTAR Xenon Ion Engine (SEP Low-Thrust Spiral)',
            cost: 65,
            mass: 165,
            dvProvided: 11.5,
            timeMonths: 42,
            bestFor: ['dawn'],
            desc: 'Record 11.5 km/s Delta-V capability! The only propulsion architecture able to orbit Vesta, escape, and orbit Ceres.'
        },
        {
            id: 'direct_high_energy',
            name: 'Cryogenic Upper Stage + Gravity Assist (GMAT Flyby)',
            cost: 55,
            mass: 390,
            dvProvided: 7.8,
            timeMonths: 36,
            bestFor: ['europa', 'dawn'],
            desc: 'High-energy interplanetary transfer trajectory with planetary orbital insertion and tour flybys.'
        }
    ],

    powerOptions: [
        {
            id: 'iss_bus_pwr',
            name: 'ISS Internal Express Rack 28V DC Bus',
            type: 'station',
            cost: 5,
            mass: 2,
            baseWatts: 180,
            desc: 'Powers the BioNutrients incubator and MELFI freezer directly from the International Space Station power grid.'
        },
        {
            id: 'solar_std',
            name: 'Compact Triple-Junction GaAs Solar Panels',
            type: 'solar',
            cost: 20,
            mass: 45,
            baseWatts: 360,
            desc: 'Deliver 360W at 1.0 AU (LEO / PUNCH). Due to the 1/R² law, output drops to 46W at 2.8 AU and just 13W at Jupiter (5.2 AU)!'
        },
        {
            id: 'solar_rosa',
            name: 'Large Roll-Out Solar Arrays (ROSA / Dawn Dutch Wings)',
            type: 'solar',
            cost: 65,
            mass: 195,
            baseWatts: 2400,
            desc: 'Generates 2400W at 1 AU and a solid 306W at 2.8 AU (Vesta/Ceres) to drive xenon ion thrusters.'
        },
        {
            id: 'rtg_mmrtg',
            name: 'Twin Multi-Mission Radioisotope Thermoelectric Generators (MMRTG)',
            type: 'nuclear',
            cost: 115,
            mass: 260,
            baseWatts: 420,
            desc: 'Pu-238 nuclear decay provides constant 420W regardless of distance from the Sun or Jupiter eclipses (5.2 AU).'
        }
    ],

    busOptions: [
        {
            id: 'bio_fep_container',
            name: 'Ultralight Bio-Container (<250g empty, FEP 3mil/5mil)',
            cost: 8,
            mass: 1.5,
            volUsed: 140,
            powerDraw: 15,
            shielding: 20,
            desc: 'Engineered for BioNutrients-2 (PDF Pages 19–20): verified <250g empty container mass with needlefree swabable Luer-Lok valves.'
        },
        {
            id: 'cubesat_4x6u',
            name: '4 x 6U SmallSat Constellation Bus (NASA CubeSat 101)',
            cost: 32,
            mass: 95,
            volUsed: 16,
            powerDraw: 45,
            shielding: 40,
            desc: 'Four 3-axis stabilized micro-spacecraft built to NASA CubeSat 101 & SmallSat Institute standards.'
        },
        {
            id: 'bus_composite',
            name: 'Composite Interplanetary Bus (Al-Graphite)',
            cost: 55,
            mass: 360,
            volUsed: 650,
            powerDraw: 60,
            shielding: 55,
            desc: 'Deep-space structural bus with 55% solar storm shielding, ideal for Main Asteroid Belt operations (Dawn).'
        },
        {
            id: 'bus_titanium_vault',
            name: 'Titanium Radiation Vault (Europa Clipper Class)',
            cost: 120,
            mass: 720,
            volUsed: 1150,
            powerDraw: 75,
            shielding: 92,
            desc: "Heavy-walled titanium-tantalum avionics vault providing 92% radiation attenuation inside Jupiter's magnetosphere."
        }
    ],

    payloads: [
        {
            id: 'fep_packs',
            name: 'BioNutrients-2 FEP Production Packs (>=12 Replicates, 30mL)',
            tag: 'BIO_LAB',
            cost: 12,
            mass: 3,
            vol: 90,
            power: 10,
            sciPoints: 180,
            icon: 'fa-seedling',
            desc: '12+ replicate 3mil FEP bags (P/N 110596-002) with dehydrated yeast spores and growth media for beta-carotene synthesis (PDF Page 18 & 20).'
        },
        {
            id: 'incubator_melfi',
            name: 'ISS Incubator (+30°C) & MELFI Cryo-Freezer Interface',
            tag: 'BIO_LAB',
            cost: 15,
            mass: 8,
            vol: 60,
            power: 45,
            sciPoints: 170,
            icon: 'fa-snowflake',
            desc: 'Maintains 30°C yeast incubation for 48 hours followed by rapid -80°C freezing in MELFI (PDF Page 16).'
        },
        {
            id: 'coronagraph_nfi',
            name: 'Narrow Field Imager (NFI Occulting Coronagraph)',
            tag: 'UV_POLAR',
            cost: 28,
            mass: 35,
            vol: 4,
            power: 40,
            sciPoints: 175,
            icon: 'fa-sun',
            desc: 'Blocks blinding photospheric glare to image the outer solar corona continuously (PUNCH mission).'
        },
        {
            id: 'polarimeter_wfi',
            name: 'Triad Wide Field Imagers (WFI Heliospheric Polarimeters)',
            tag: 'UV_POLAR',
            cost: 38,
            mass: 55,
            vol: 4,
            power: 65,
            sciPoints: 195,
            icon: 'fa-eye',
            desc: 'Measures polarized Thomson-scattered light from solar wind electrons across 3D space.'
        },
        {
            id: 'framing_cam',
            name: 'Dual Framing Camera + Visible/IR Mapping Spectrometer (VIR)',
            tag: 'VIS_IR_GAMMA',
            cost: 45,
            mass: 85,
            vol: 180,
            power: 55,
            sciPoints: 190,
            icon: 'fa-camera-retro',
            desc: 'Maps surface geology, craters, and hydrated minerals on Vesta and Ceres (Dawn mission).'
        },
        {
            id: 'grond_spec',
            name: 'Gamma Ray and Neutron Detector (GRaND)',
            tag: 'VIS_IR_GAMMA',
            cost: 42,
            mass: 75,
            vol: 160,
            power: 45,
            sciPoints: 185,
            icon: 'fa-atom',
            desc: 'Detects subsurface hydrogen (water ice), iron, and potassium elemental abundances.'
        },
        {
            id: 'ice_radar_reason',
            name: 'REASON Dual-Frequency Ice-Penetrating VHF Radar',
            tag: 'RADAR_MAG_IR',
            cost: 65,
            mass: 165,
            vol: 380,
            power: 95,
            sciPoints: 230,
            icon: 'fa-wave-square',
            desc: "Sounds Europa's icy shell from surface down to 30 km depth to locate the liquid ocean interface."
        },
        {
            id: 'mag_icm',
            name: 'Interior Characterization Magnetometer (ECM)',
            tag: 'RADAR_MAG_IR',
            cost: 40,
            mass: 55,
            vol: 140,
            power: 35,
            sciPoints: 175,
            icon: 'fa-magnet',
            desc: "Measures induced magnetic fields to determine Europa's subsurface ocean depth and salinity."
        },
        {
            id: 'thermal_ethemis',
            name: 'E-THEMIS Thermal Emission Infrared Imager',
            tag: 'RADAR_MAG_IR',
            cost: 38,
            mass: 65,
            vol: 150,
            power: 45,
            sciPoints: 165,
            icon: 'fa-temperature-arrow-up',
            desc: 'Scans for warm ice fractures and active cryovolcanic water vapor plumes.'
        }
    ],

    groundSegments: [
        {
            id: 'iss_payload_ops',
            name: 'ISS Payload Operations Center (Real-Time Video & Thermal Telemetry)',
            cost: 8,
            efficiency: { bionutrients: 1.0, punch: 0.75, dawn: 0.15, europa: 0.05 },
            desc: 'Scientists and engineers watch experiment initiation in real-time via ISS video link, then monitor incubation temperature from the ground (PDF Pages 14 & 16).'
        },
        {
            id: 'nsn_sband',
            name: 'NASA Near Space Network (S/X-Band LEO Ground Stations)',
            cost: 18,
            efficiency: { bionutrients: 1.0, punch: 1.0, dawn: 0.45, europa: 0.15 },
            desc: 'High-rate downlink network tailored for Low Earth Orbit constellations like PUNCH.'
        },
        {
            id: 'dsn_xband',
            name: 'NASA Deep Space Network (34m X-Band Beam-Waveguide)',
            cost: 40,
            efficiency: { bionutrients: 1.0, punch: 1.0, dawn: 1.0, europa: 0.65 },
            desc: 'Goldstone, Madrid, and Canberra 34m antennas supporting Asteroid Belt navigation and telemetry (2.8 AU).'
        },
        {
            id: 'dsn_kaband_70m',
            name: 'NASA Deep Space Network (70m Flagship Dishes + Ka-Band Array)',
            cost: 75,
            efficiency: { bionutrients: 1.0, punch: 1.0, dawn: 1.0, europa: 1.0 },
            desc: 'Maximum gain array required to receive high-volume radar and spectral data from Jupiter orbit (5.2 AU).'
        }
    ],

    userSegments: [
        {
            id: 'user_centrifuge',
            name: 'Bio-Analysis Pipeline: Delivery -> Thaw -> Wash -> Centrifuge -> Assay',
            cost: 10,
            bestFor: 'bionutrients',
            desc: 'Exact 5-step User Segment workflow from PDF Page 15: 1. Receive frozen samples -> 2. Thaw -> 3. Empty & Wash -> 4. Centrifuge -> 5. Analyze beta-carotene (>=3 ug/mL) & publish.'
        },
        {
            id: 'user_tomography',
            name: '3D Heliospheric Tomography & Space Weather Modeling Pipeline',
            cost: 15,
            bestFor: 'punch',
            desc: 'Merges polarized images from all 4 PUNCH spacecraft into unified 3D solar wind density maps for heliophysicists.'
        },
        {
            id: 'user_gis_mapping',
            name: 'Planetary Data System (PDS) 3D Mineralogy & Gravity Atlas',
            cost: 20,
            bestFor: 'dawn',
            desc: 'Constructs global geochemical and topographic globes of Vesta and Ceres for planetary evolution research.'
        },
        {
            id: 'user_astrobiology',
            name: 'Ocean Worlds Astrobiology & Habitability Science Consortium',
            cost: 28,
            bestFor: 'europa',
            desc: "Combines ice-penetrating radar, magnetic induction, and plume thermal data to evaluate Europa's ocean habitability."
        }
    ]
};