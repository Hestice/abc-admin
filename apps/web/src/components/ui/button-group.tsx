import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  Search,
  User,
  UserRound,
  Users,
} from 'lucide-react';

// Map of icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CheckCircle,
  XCircle,
  HelpCircle,
  Search,
  Male: User,
  Female: UserRound,
  Users,
};

interface ButtonGroupProps {
  options: { value: string; label: string; icon?: string }[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  className?: string;
}

export function ButtonGroup({
  options,
  value,
  onChange,
  name,
  className,
}: ButtonGroupProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const IconComponent = option.icon ? iconMap[option.icon] : undefined;

        return (
          <Button
            key={option.value}
            type="button"
            variant={value === option.value ? 'default' : 'outline'}
            className="flex items-center gap-2"
            onClick={() => onChange(option.value)}
          >
            {IconComponent && <IconComponent className="w-4 h-4" />}
            {option.label}
          </Button>
        );
      })}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
