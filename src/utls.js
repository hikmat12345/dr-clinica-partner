export const dateFormater = (date) => {
  const dateStr = date
  const dateObj = new Date(dateStr)

  const year = dateObj.getFullYear()
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const day = dateObj.getDate().toString().padStart(2, '0')
  const hours = dateObj.getHours().toString().padStart(2, '0')
  const minutes = dateObj.getMinutes().toString().padStart(2, '0')

  const dateTimeStr = `${year}-${month}-${day}T${hours}:${minutes}`
  console.log(dateTimeStr, 'dateTimeStr') // Output: 2018-04-30T12:30
  return dateTimeStr
}

export const findDuration = (startTimeString, endTimeString) => {
  // Split the time strings into hours and minutes
  const startTimeParts = startTimeString?.split(':')
  const endTimeParts = endTimeString?.split(':')

  // Convert the hours and minutes to numbers
  const startHours = parseInt(startTimeParts[0])
  const startMinutes = parseInt(startTimeParts[1])
  const endHours = parseInt(endTimeParts[0])
  const endMinutes = parseInt(endTimeParts[1])

  // Calculate the start and end times as Date objects
  const startDate = new Date()
  startDate?.setHours(startHours)
  startDate?.setMinutes(startMinutes)
  const endDate = new Date()
  endDate?.setHours(endHours)
  endDate?.setMinutes(endMinutes)

  // If the end time is before the start time (e?.g?., for times like 1:20), add a day to the end date
  if (
    endHours < startHours ||
    (endHours === startHours && endMinutes < startMinutes)
  ) {
    endDate?.setDate(endDate?.getDate() + 1)
  }

  // Calculate the duration in milliseconds
  const duration = endDate?.getTime() - startDate?.getTime()

  // Convert the duration to minutes and hours
  const durationMinutes = Math?.floor(duration / (1000 * 60))
  const durationHours = Math?.floor(duration / (1000 * 60 * 60))

  return `${durationMinutes}m - ${durationHours}h`
}


export function getDurationInMinutes(startTime, endTime) {
  console.log(startTime, endTime, 'startTime, endTime')
  const start = new Date(`1970-01-01T${startTime}:00`);

  const end = new Date(`1970-01-01T${endTime}:00`);
  const durationInMs = end - start;
  const durationInMinutes = durationInMs / 1000 / 60;
  return durationInMinutes;
}

export function getDayName(dateString) {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const date = new Date(dateString);
  const dayIndex = date.getDay();
  
  return weekdays[dayIndex];
}
 
export function  getDayTime(day, scheduleArray) {
    const schedule = scheduleArray.find(item => item.day === day);
    if (schedule) {
      console.log( schedule.startime, schedule.endtime, 'startTime: schedule.startime')
      return {
        startTime: schedule.startime==""?"0":schedule.startime?.split(":")[0],
        endTime: schedule.endtime==""?"1":schedule.endtime?.split(":")[0]
      };
    } else {
      return {
        startTime: schedule.startime==""?"0":"9",
        endTime: schedule.endtime==""?"1":"22"
      };
    }
  } 