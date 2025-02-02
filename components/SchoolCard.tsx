'use client'
import { School } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar, Flag, Phone, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export  function SchoolCard({ school }: { school: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="col-span-2 overflow-hidden bg-white/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3 text-blue-600">
                <Building className="h-6 w-6" />
                {school.name}
              </CardTitle>
              <p className="text-gray-600 mt-2">{school.address}</p>
            </div>
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
              {school.city}, {school.country}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            <InfoItem
              icon={<Users className="h-4 w-4 text-blue-600" />}
              label="Administrator"
              value={`${school.adminFirstName} ${school.adminLastName}`}
            />
            <InfoItem
              icon={<Phone className="h-4 w-4 text-blue-600" />}
              label="Contact"
              value={school.phone}
            />
            <InfoItem
              icon={<Flag className="h-4 w-4 text-blue-600" />}
              label="Established"
              value={new Date(school.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            />
            <InfoItem
              icon={<Calendar className="h-4 w-4 text-blue-600" />}
              label="Last Updated"
              value={new Date(school.updatedAt).toLocaleDateString()}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-gray-600">
        {icon}
        <span>{label}:</span>
      </div>
      <p className="font-medium text-gray-900 pl-6">{value}</p>
    </div>
  );
}

export function StatsCard({ studentsCount, reportsCount, phone, established }: {
  studentsCount: number;
  reportsCount: number;
  phone: string;
  established: Date;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardContent className="pt-6 space-y-8">
          <StatItem
            label="Total Students"
            value={studentsCount}
            icon={<Users className="h-8 w-8 text-blue-600/60" />}
          />
          <StatItem
            label="Reports Generated"
            value={reportsCount}
            icon={<Flag className="h-8 w-8 text-blue-600/60" />}
          />
          <InfoRow
            icon={<Phone className="h-4 w-4 text-blue-600" />}
            label="Contact Number"
            value={phone}
          />
          <InfoRow
            icon={<Calendar className="h-4 w-4 text-blue-600" />}
            label="Established"
            value={established.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
            })}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatItem({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-blue-600">{value}</p>
      </div>
      {icon}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 text-sm">
      {icon}
      <div>
        <p className="text-gray-600">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}