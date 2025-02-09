
export interface StoreBadge {
  id: string;
  name: string;
  description: string;
  cost: number;
  badge_type: 'beginner' | 'expert' | 'master';
  icon: string;
}

export interface PurchasedBadge {
  badge_id: string;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  remaining_points?: number;
}
