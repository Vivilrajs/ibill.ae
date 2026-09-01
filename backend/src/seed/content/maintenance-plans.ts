export interface MaintenancePlanSeed {
  name: string;
  summary: string;
  annualFee: number;
  feeNote: string;
  inclusions: string[];
  order: number;
  published: boolean;
}

/** Populated by the client via the admin panel. */
export const MAINTENANCE_PLANS: MaintenancePlanSeed[] = [];
