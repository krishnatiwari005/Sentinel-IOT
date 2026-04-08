export type FaceType = 'UNKNOWN' | 'VIP';

export interface Detection {
  id: string;
  face_type: FaceType;
  vip_name: string | null;
  image_url: string;
  timestamp: string;
  created_at: string;
  status: string;
  confidence: number;
}

export interface Vip {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
}

export interface Settings {
  id: string;
  user_id: string;
  vip_mode: boolean;
  sensitivity: 'Low' | 'Medium' | 'High';
  storage_quality: 'Low' | 'Medium' | 'High';
}

export interface UserRole {
  role: 'admin' | 'viewer';
}
