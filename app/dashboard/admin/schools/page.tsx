// app/schools/page.tsx
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

async function getSchools() {
  const schools = await prisma.school.findMany();
  return schools;
}

export default async function SchoolsPage() {
  const schools = await getSchools();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Schools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schools.map((school) => (
          
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle>{school.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {school.city}, {school.state}
                </p>
              </CardContent>
            </Card>
        
        ))}
      </div>
    </div>
  );
}