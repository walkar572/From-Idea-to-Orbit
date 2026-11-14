   export type SMDDivision = 'BPS' | 'HELIO' | 'PLANET';
   export type WavelengthTag = 'BIO_LAB' | 'UV_POLAR' | 'VIS_IR_GAMMA' | 'RADAR_MAG_IR';
   export type MissionId = 'bionutrients' | 'punch' | 'dawn' | 'europa';
   export type Stage = 1 | 2 | 3;
   export type SegmentTab = 'launch' | 'space' | 'ground' | 'user';
   export type VizCamera = '3d' | 'top' | 'follow';
   export type PowerType = 'station' | 'solar' | 'nuclear';
   export type SMD = 'ALL' | SMDDivision;
   
   export interface ConopsEvent {
       title: string;
       desc: string;
       opt1Title: string;
       opt1Desc: string;
       opt2Title: string;
       opt2Desc: string;
   }
   
   export interface OptimalPreset {
       launchId: string;
       propulsionId: string;
       powerId: string;
       busId: string;
       payloads: string[];
       groundId: string;
       userId: string;
   }
   
   export interface Mission {
       id: MissionId;
       code: string;
       smdDivision: SMDDivision;
       smdLabel: string;
       name: string;
       orbitLabel: string;
       au: number;
       budgetLimit: number;
       maxVolumeUnit: number;
       volUnitLabel: string;
       radHazard: number;
       wavelengthReq: WavelengthTag;
       wavelengthLabel: string;
       needStatement: string;
       goalsList: string[];
       requiredPayloads: string[];
       realComparison: string;
       officeHoursHint: string;
       optimalPreset: OptimalPreset;
       conopsEvent: ConopsEvent;
   } 
   export interface LaunchVehicle {
       id: string;
       name: string;
       cost: number;
       maxMass: number;
       maxVolBonus: number;
       allowedMissions: MissionId[];
       desc: string;
   }
   
   export interface PropulsionOption {
       id: string;
       name: string;
       cost: number;
       mass: number;
       dvProvided: number;
       timeMonths: number;
       bestFor: MissionId[];
       desc: string;
   }
   
   export interface PowerOption {
       id: string;
       name: string;
       type: PowerType;
       cost: number;
       mass: number;
       baseWatts: number;
       desc: string;
   }
   
   export interface BusOption {
       id: string;
       name: string;
       cost: number;
       mass: number;
       volUsed: number;
       powerDraw: number;
       shielding: number;
       desc: string;
   }
   
   export interface Payload {
       id: string;
       name: string;
       tag: WavelengthTag;
       cost: number;
       mass: number;
       vol: number;
       power: number;
       sciPoints: number;
       icon: string;
       desc: string;
   }
   
   export interface GroundSegment {
       id: string;
       name: string;
       cost: number;
       efficiency: Record<MissionId, number>;
       desc: string;
   }
   
   export interface UserSegment {
       id: string;
       name: string;
       cost: number;
       bestFor: MissionId;
       desc: string;
   }
   
   export interface SegmentsDB {
       launchVehicles: LaunchVehicle[];
       propulsionOptions: PropulsionOption[];
       powerOptions: PowerOption[];
       busOptions: BusOption[];
       payloads: Payload[];
       groundSegments: GroundSegment[];
       userSegments: UserSegment[];
   }
   export interface GameState {
       stage: Stage;
       smdFilter: SMD;
       activeSegmentTab: SegmentTab;
       missionId: MissionId;

       launchId: string;
       propulsionId: string;
       powerId: string;
       busId: string;
       payloads: string[];
       groundId: string;
       userId: string;
      
       vizCamera: VizCamera;
   }
   export interface ArchitectureEval {
       m: Mission;
       launch: LaunchVehicle;
       prop: PropulsionOption;
       power: PowerOption;
       bus: BusOption;
       ground: GroundSegment;
       user: UserSegment;
       selectedPayloadObjs: Payload[];
   
       totalCost: number;
       budgetOk: boolean;
   
       totalMass: number;
       massOk: boolean;
   
       totalVol: number;
       maxAllowedVol: number;
       volOk: boolean;
   
       wattsGenerated: number;
       wattsConsumed: number;
       powerOk: boolean;
   
       missingReqPayloads: string[];
       incompatiblePayloads: Payload[];
       payloadReqOk: boolean;
   
       trajOk: boolean;
       groundEff: number;
       groundOk: boolean;
       userOk: boolean;
       shieldOk: boolean;

       checksPassed: number;
       totalChecks: number;
       cmlLevel: 1 | 2 | 3 | 4;
       cmlText: string;
       mdlText: string;
   }
