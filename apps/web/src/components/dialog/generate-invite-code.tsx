import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { UserPlus, Copy, Check } from 'lucide-react';
import { DialogFooter } from '../ui/dialog';
import { createInviteCode, ApiError } from '@/utils/invite-codes';
import Link from 'next/link';

interface GenerateInviteCodeProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  onInviteCodeGenerated?: () => void;
}

export default function GenerateInviteCode({
  isDialogOpen,
  setIsDialogOpen,
  onInviteCodeGenerated,
}: GenerateInviteCodeProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedCode(null);
    setCopied(false);

    try {
      const inviteCode = await createInviteCode();
      setGeneratedCode(inviteCode.code);
      if (onInviteCodeGenerated) {
        onInviteCodeGenerated();
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to generate invite code. Please try again.');
      }
      console.error('Failed to generate invite code:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!generatedCode) return;

    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setIsDialogOpen(false);
      setGeneratedCode(null);
      setError(null);
      setCopied(false);
    } else {
      setIsDialogOpen(true);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Generate Invite Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] w-[calc(100%-2rem)]">
        <DialogHeader>
          <DialogTitle>Generate Invite Code</DialogTitle>
          <DialogDescription>
            Generate a new invite code for administrator signup. Share this code
            with the person you want to invite. They will need to enter this
            code when signing up.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {generatedCode ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-sm font-medium text-green-800 mb-2">
                  Invite code generated successfully!
                </p>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Invite Code:
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 p-2 bg-white border rounded text-sm font-mono break-all">
                        {generatedCode}
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopyCode}
                        className="shrink-0"
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Share this code with the person you want to invite. They will
                need to enter it when signing up at{' '}
                <Link
                  href="/signup"
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  /signup
                </Link>
                . The code can only be used once.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Click the button below to generate a new invite code.
            </p>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
            className="w-full sm:w-auto"
          >
            {generatedCode ? 'Close' : 'Cancel'}
          </Button>
          {!generatedCode && (
            <Button
              type="button"
              onClick={handleGenerate}
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Invite Code'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
