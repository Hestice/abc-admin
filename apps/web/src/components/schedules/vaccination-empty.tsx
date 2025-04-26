import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface VaccinationEmptyProps {
  onBack: () => void;
}

export function VaccinationEmpty({ onBack }: VaccinationEmptyProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <p className="mb-4">
            No vaccination schedule found for this patient.
          </p>
          <Button onClick={onBack}>Back to Patient Details</Button>
        </div>
      </CardContent>
    </Card>
  );
}
