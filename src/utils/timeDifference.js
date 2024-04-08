export default function timeDifference(date){
    const now = new Date();
    const postDate = new Date(date);

    // Difference in milliseconds
    const diffMilliseconds = now - postDate;
    // Convert to different units
    const diffSeconds = diffMilliseconds / 1000;
    const diffMinutes = diffSeconds / 60;
    const diffHours = diffMinutes / 60;
    const diffDays = diffHours / 24;

    if (diffDays > 1){
        return `${Math.round(diffDays)} days ago`
    }
    else if (diffHours > 1){
        return `${Math.round(diffHours)} hours ago`
    }
    else if (diffMinutes > 1){
        return `${Math.round(diffMinutes)} minutes ago`
    }
    else if (diffSeconds > 1){
        return `${Math.round(diffSeconds)} seconds ago`
    }
    else{
        return `just now`
    }
  }
