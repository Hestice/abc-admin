import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function VaccinationLoading() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading vaccination schedule...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
