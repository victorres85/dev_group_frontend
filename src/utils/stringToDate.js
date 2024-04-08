export default function stringToDate(dateStr){
  let date = new Date(dateStr);

  let day = String(date.getUTCDate()).padStart(2, '0');
  let month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
  let year = date.getUTCFullYear();

  let formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}