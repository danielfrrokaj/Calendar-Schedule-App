import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://bcsyqrloqnrmjzpoldfk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjc3lxcmxvcW5ybWp6cG9sZGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3OTcxNzUsImV4cCI6MjA1NjM3MzE3NX0.2APbq3omttsK_XvEnbSdzjqwgtyovErQJW0rPIPVJfA'

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function saveScheduleToSupabase(courses, endDate) {
    try {
        // First, insert the schedule
        const { data: schedule, error: scheduleError } = await supabase
            .from('schedules')
            .insert([
                { 
                    end_date: endDate,
                    created_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (scheduleError) throw scheduleError;

        // Then, insert all courses with the schedule_id
        const coursesWithScheduleId = courses.map(course => ({
            schedule_id: schedule.id,
            course_name: course.courseName,
            day: course.day,
            start_time: course.startTime,
            end_time: course.endTime,
            professor: course.professor || null,
            room: course.room,
            created_at: new Date().toISOString()
        }));

        const { error: coursesError } = await supabase
            .from('courses')
            .insert(coursesWithScheduleId);

        if (coursesError) throw coursesError;

        return schedule.id;
    } catch (error) {
        console.error('Error saving to Supabase:', error);
        throw error;
    }
} 