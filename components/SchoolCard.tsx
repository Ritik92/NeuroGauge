// app/dashboard/components/SchoolCard.tsx
import { School } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar, Flag, Phone, Users } from 'lucide-react';

export function SchoolCard({ school }: { school: School }) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Building className="h-6 w-6 text-muted-foreground" />
              {school.name}
            </CardTitle>
            <p className="text-muted-foreground mt-2">{school.address}</p>
          </div>
          <Badge variant="outline" className="text-sm">
            {school.city}, {school.country}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Administrator:</span>
            </div>
            <p className="font-medium">
              {school.adminFirstName} {school.adminLastName}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>Contact:</span>
            </div>
            <p className="font-medium">{school.phone}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Flag className="h-4 w-4" />
              <span>Established:</span>
            </div>
            <p className="font-medium">
              {new Date(school.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Last Updated:</span>
            </div>
            <p className="font-medium">
              {new Date(school.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Add this new component for stats
export function StatsCard({ studentsCount, reportsCount, phone, established }: { 
  studentsCount: number;
  reportsCount: number;
  phone: string;
  established: Date;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">{studentsCount}</p>
            </div>
            <Users className="h-8 w-8 text-primary/60" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Reports Generated</p>
              <p className="text-2xl font-bold">{reportsCount}</p>
            </div>
            <Flag className="h-8 w-8 text-primary/60" />
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <div>
              <p className="text-muted-foreground">Contact Number</p>
              <p className="font-medium">{phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <div>
              <p className="text-muted-foreground">Established</p>
              <p className="font-medium">
                {established.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}