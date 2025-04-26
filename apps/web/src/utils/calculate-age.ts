export default function CalculateAge(birthDate: Date) {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  const age = today.getFullYear() - birthDateObj.getFullYear();
  return age;
}
