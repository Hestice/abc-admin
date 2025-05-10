import React from 'react';
import { TooltipContent } from '../ui/tooltip';
import { TooltipTrigger } from '../ui/tooltip';
import { Tooltip } from '../ui/tooltip';
import { TooltipProvider } from '../ui/tooltip';
import { HelpCircle } from 'lucide-react';

export default function PasswordRequirements() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="w-80 p-4">
          <p className="font-medium mb-2">Password Requirements:</p>
          <ul className="text-sm space-y-1">
            <li>• At least 14 characters long</li>
            <li>• At least one uppercase letter</li>
            <li>• At least one lowercase letter</li>
            <li>• At least one number</li>
            <li>• At least one special character</li>
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
