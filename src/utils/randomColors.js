 export default function generateRandomHexFromShade(baseHex) {
  function clamp(value) {
    
    return Math.min(255, Math.max(0, value));

   
  }

  const r = parseInt(baseHex.slice(1, 3), 16);
  const g = parseInt(baseHex.slice(3, 5), 16);
  const b = parseInt(baseHex.slice(5, 7), 16);

  const range = 50;
  const randomR = clamp(r + Math.floor(Math.random() * range - range/2));
  const randomG = clamp(g + Math.floor(Math.random() * range - range/2));
  const randomB = clamp(b + Math.floor(Math.random() * range - range/2));
  
  const toHex = (value) => value.toString(16).padStart(2, '0');
  return `#${toHex(randomR)}${toHex(randomG)}${toHex(randomB)}`;

}
