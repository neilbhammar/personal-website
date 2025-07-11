export type UserType = 'founder' | 'employee' | null;
export type EquityType = 'rsa' | 'iso' | 'dont-know' | null;

export interface EquityGuideProps {
  onBack?: () => void;
  onRestart?: () => void;
  onNavigate?: (userType: UserType, equityType?: EquityType) => void;
}

export interface NavigationProps {
  showBack?: boolean;
  showRestart?: boolean;
  onBack?: () => void;
  onRestart?: () => void;
} 