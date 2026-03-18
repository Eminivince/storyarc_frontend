import React from "react";
import {
  AlertCircle,
  Bell,
  BellDot,
  BookMarked,
  BookOpen,
  BookOpenCheck,
  BookmarkPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CloudOff,
  Coins,
  CreditCard,
  Edit3,
  Eye,
  EyeOff,
  Flag,
  Gift,
  Home,
  Info,
  Link2,
  ListChecks,
  Lock,
  LockOpen,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Plus,
  Rocket,
  Search,
  Settings,
  Share2,
  Shield,
  Star,
  StarHalf,
  SunMedium,
  User,
  Users,
} from "lucide-react";

const ICON_MAP = {
  // Reader / stories
  auto_stories: BookOpen,
  menu_book: BookOpenCheck,
  book: BookOpen,

  // Navigation / generic
  home: Home,
  menu: Menu,
  more_horiz: MoreHorizontal,

  // Progress / actions
  chevron_right: ChevronRight,
  chevron_left: ChevronLeft,
  expand_more: ChevronDown,
  expand_less: ChevronUp,
  add: Plus,
  edit: Pencil,
  edit_note: Edit3,
  flag: Flag,
  report: Flag,
  logout: LogOut,

  // Notifications
  notifications: Bell,
  notifications_active: BellDot,

  // Bookmarks / library
  bookmark: BookMarked,
  bookmark_add: BookmarkPlus,

  // Status / feedback
  check_circle: CheckCircle2,
  info: Info,
  error: AlertCircle,

  // Media / rating
  star: Star,
  star_half: StarHalf,

  // Connectivity
  cloud_off: CloudOff,

  // Monetization / rewards
  paid: Coins,
  card_giftcard: Gift,
  workspace_premium: Shield,

  // Security
  lock: Lock,
  lock_open: LockOpen,

  // User
  person: User,
  group: Users,
  mail: Mail,

  // Social / interactions
  chat_bubble: MessageCircle,
  share: Share2,
  link: Link2,

  // Misc
  visibility: Eye,
  visibility_off: EyeOff,
  checklist: ListChecks,
  rocket_launch: Rocket,
  sunny: SunMedium,
};

export function Icon({ name, className = "", ...props }) {
  const LucideIcon = ICON_MAP[name] || AlertCircle;
  return <LucideIcon className={className} aria-hidden="true" {...props} />;
}

