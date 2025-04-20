'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CopyableItemProps {
  label: string;
  value: string;
  displayValue?: React.ReactNode;
  className?: string;
  copyMessage?: string;
}

export function CopyableItem({
  label,
  value,
  displayValue,
  className,
  copyMessage = 'Copied to clipboard',
}: CopyableItemProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast({
      description: copyMessage,
      duration: 2000,
    });
  };

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <Button
        variant="ghost"
        className={cn(
          'h-auto w-full justify-start px-2 py-1.5 text-left font-normal hover:bg-muted hover:text-primary',
          className
        )}
        onClick={handleCopy}
        title={`Click to copy ${label.toLowerCase()}`}
      >
        {displayValue || value}
      </Button>
    </div>
  );
}
