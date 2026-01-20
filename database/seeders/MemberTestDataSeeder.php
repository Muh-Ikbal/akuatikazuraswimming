<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Member;
use App\Models\Coach;
use App\Models\Course;
use App\Models\ClassSession;
use App\Models\EnrolmentCourse;
use App\Models\Schedule;
use App\Models\Attendance;
use Carbon\Carbon;

class MemberTestDataSeeder extends Seeder
{
    /**
     * Seed test data for member jadwal feature testing.
     */
    public function run(): void
    {
        // Get users
        $memberUser = User::where('email', 'member@azura.id')->first();
        $coachUser = User::where('email', 'coach@azura.id')->first();

        if (!$memberUser || !$coachUser) {
            $this->command->error('Users not found. Please run UserInitiationSeeder first.');
            return;
        }

        // 1. Create Coach profile
        $coach = Coach::firstOrCreate(
            ['user_id' => $coachUser->id],
            [
                'name' => 'Coach Budi',
                'phone_number' => '081234567890',
                'birth_date' => '1985-05-15',
                'gender' => 'L',
                'image' => '',
            ]
        );
        $this->command->info('✓ Coach created: ' . $coach->name);

        // 2. Create Course
        $course = Course::firstOrCreate(
            ['title' => 'Intermediate Swimming'],
            [
                'description' => 'Kursus renang tingkat menengah untuk yang sudah bisa berenang dasar.',
                'total_meeting' => 12,
                'weekly_meeting_count' => 2,
                'price' => 1500000,
                'state' => 'active',
                'image' => '',
            ]
        );
        $this->command->info('✓ Course created: ' . $course->title);

        // 3. Create Class Session
        $classSession = ClassSession::firstOrCreate(
            ['title' => 'Kelas Intermediate A'],
            [
                'course_id' => $course->id,
                'coach_id' => $coach->id,
                'capacity' => 10,
            ]
        );
        $this->command->info('✓ Class Session created: ' . $classSession->title);

        // 4. Create Member profile
        $member = Member::firstOrCreate(
            ['user_id' => $memberUser->id],
            [
                'name' => 'Siti Nurhaliza',
                'birth_date' => '2010-03-20',
                'gender' => 'P',
                'address' => 'Jl. Merdeka No. 123, Jakarta',
                'phone_number' => '081987654321',
                'parent_name' => 'Budi Santoso',
                'parent_phone_number' => '081555666777',
            ]
        );
        $this->command->info('✓ Member created: ' . $member->name);

        // 5. Create Enrolment
        $enrolment = EnrolmentCourse::firstOrCreate(
            [
                'member_id' => $member->id,
                'class_session_id' => $classSession->id,
            ],
            [
                'course_id' => $course->id,
                'state' => 'on_progress',
            ]
        );
        $this->command->info('✓ Enrolment created');

        // 6. Create Schedules (12 meetings, every Tuesday and Thursday)
        $startDate = Carbon::now()->startOfMonth();
        $meetingCount = 0;
        $schedulesCreated = 0;
        
        // Generate schedules starting from this month
        $currentDate = $startDate->copy();
        
        while ($meetingCount < 12) {
            // Skip weekends and find Tuesday (2) or Thursday (4)
            if ($currentDate->dayOfWeek === Carbon::TUESDAY || $currentDate->dayOfWeek === Carbon::THURSDAY) {
                $status = 'published';
                
                // Mark past dates as completed
                if ($currentDate->lt(today())) {
                    $status = 'completed';
                } elseif ($currentDate->eq(today())) {
                    $status = 'on_going';
                }
                
                Schedule::firstOrCreate(
                    [
                        'class_session_id' => $classSession->id,
                        'date' => $currentDate->toDateString(),
                    ],
                    [
                        'time' => '09:30:00',
                        'location' => 'Kolam Utama',
                        'status' => $status,
                    ]
                );
                
                $meetingCount++;
                $schedulesCreated++;
            }
            
            $currentDate->addDay();
        }
        
        $this->command->info('✓ Schedules created: ' . $schedulesCreated . ' meetings');
        
        // 7. Create Attendance records for past schedules
        $pastSchedules = Schedule::where('class_session_id', $classSession->id)
            ->where('status', 'completed')
            ->get();
        
        $attendanceCreated = 0;
        foreach ($pastSchedules as $index => $schedule) {
            // Create attendance for 70% of completed schedules (simulate realistic attendance)
            // Randomly skip some to show "absent" status
            if ($index % 3 !== 0) { // Skip every 3rd schedule
                $scanTime = Carbon::parse($schedule->date . ' ' . $schedule->time)
                    ->addMinutes(rand(-10, 15)); // Scan time around schedule time
                
                Attendance::firstOrCreate(
                    [
                        'user_id' => $memberUser->id,
                        'class_session_id' => $classSession->id,
                        'schedule_id' => $schedule->id, // Link to specific schedule
                    ],
                    [
                        'scan_time' => $scanTime,
                    ]
                );
                $attendanceCreated++;
            }
        }
        
        $this->command->info('✓ Attendance records created: ' . $attendanceCreated . ' out of ' . $pastSchedules->count() . ' completed schedules');
        $this->command->info('');
        $this->command->info('🎉 Test data seeding completed!');
        $this->command->info('You can now login as member@azura.id and see the schedules and attendance history.');
    }
}
