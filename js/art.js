// Artwork for Zagel. Drawn as SVG; every piece can be swapped for Zoi's own drawings later.
export const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><filter id="zpn" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="7" result="g"/><feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1 0 0 0 1.35" result="ga"/><feComposite in="d" in2="ga" operator="in"/></filter>
<filter id="zglow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b"/><feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .8 0" result="bb"/><feMerge><feMergeNode in="bb"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="zp" x="-15%" y="-15%" width="130%" height="130%">
<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" xChannelSelector="R" yChannelSelector="G" result="d"/>
<feTurbulence type="fractalNoise" baseFrequency="1.7" numOctaves="1" seed="9" result="g"/>
<feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.9 0 0 0 1.32" result="ga"/>
<feComposite in="d" in2="ga" operator="in"/>
</filter>
<g id="eyes2"><circle cx="-5" cy="0" r="4.2" fill="#fff"/><circle cx="5" cy="0" r="4.2" fill="#fff"/><circle cx="-3.6" cy=".6" r="1.8" fill="#141414" stroke="none"/><circle cx="6.4" cy=".6" r="1.8" fill="#141414" stroke="none"/></g>
<!-- drawing -->

<!-- out & about -->

<!-- shows & movies -->
<g id="c-show"><g filter="url(#zp)" stroke="#2E2C29" stroke-width="1.2" stroke-linejoin="round">
 <line x1="-5" y1="6" x2="-6" y2="16"/><line x1="5" y1="6" x2="6" y2="16"/><line x1="-18" y1="-6" x2="-25" y2="2"/><line x1="18" y1="-6" x2="25" y2="0"/>
 <path d="M-6 -26 l-6 -10 M6 -26 l6 -10" fill="none"/>
 <rect x="-18" y="-26" width="36" height="32" rx="5" fill="#8FB0E8"/><rect x="-13" y="-21" width="26" height="22" rx="3" fill="#DCE7F5"/><use href="#eyes2" y="-11"/>
</g></g>
<!-- eating out : sushi -->

<!-- reading -->

<!-- friends -->

<!-- outfit -->
<g id="c-outfit"><g filter="url(#zp)" stroke="#2E2C29" stroke-width="1.2" stroke-linejoin="round">
 <line x1="-5" y1="20" x2="-6" y2="30"/><line x1="5" y1="20" x2="6" y2="30"/>
 <path d="M-7 -12 L7 -12 L18 20 Q0 24 -18 20 Z" fill="#E8574A"/>
 <path d="M-1 -14 l-10 -6 l0 10 z M1 -14 l10 -6 l0 10 z" fill="#1F1E1C"/><circle cx="0" cy="-14" r="2.6" fill="#1F1E1C"/>
 <use href="#eyes2" y="2"/>
</g></g>
<!-- lazy day -->

<g id="zoi-body">
 <g filter="url(#zp)" stroke="#2E2C29" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
  <line x1="-7" y1="40" x2="-9" y2="60"/><line x1="7" y1="40" x2="9" y2="60"/>
  <ellipse cx="-11" cy="61.5" rx="5" ry="2.8" fill="#F4E15A"/><ellipse cx="11" cy="61.5" rx="5" ry="2.8" fill="#F4E15A"/>
  <line x1="-12" y1="14" x2="-22" y2="30"/><line x1="12" y1="14" x2="22" y2="28"/>
  <path d="M-12 8 L12 8 L23 42 Q0 48 -23 42 Z" fill="#1F1E1C"/>
  <path d="M-30 -6 Q-36 -34 -14 -42 Q4 -48 20 -40 Q36 -30 31 -4 Q34 4 28 8 Q26 2 22 4 Q16 12 0 12 Q-16 12 -22 4 Q-26 2 -29 8 Q-34 4 -30 -6 Z" fill="#4A68F2"/>
  <path d="M-21 -8 Q-21 -30 0 -31 Q21 -30 21 -8 Q21 9 0 10 Q-21 9 -21 -8 Z" fill="#4A68F2" stroke="none"/>
  <path d="M-20 -6 Q-17 10 0 10 Q17 10 20 -6" fill="none"/>
  <path d="M-15 -30 q4 7 2 14 M-9 -30 q3 6 1 12 M-3 -30 q2 5 1 10 M13 -30 q-4 7 -2 13" fill="none" stroke-width="1.1"/>
  <path d="M-26 -12 q-3 8 1 14 M26 -12 q3 8 -1 14" fill="none" stroke-width="1"/>
  <path d="M-14 -11 Q-9 -15 -3 -11 Q-9 -7.5 -14 -11 Z" fill="#F4E15A"/>
  <path d="M3 -11 Q9 -15 14 -11 Q9 -7.5 3 -11 Z" fill="#F4E15A"/>
  <ellipse cx="-6" cy="-11" rx="2.2" ry="2.6" fill="#141414" stroke="none"/><ellipse cx="11" cy="-11" rx="2.2" ry="2.6" fill="#141414" stroke="none"/>
  <path d="M-12 -7.5 l-1 2 M-8 -7 l-.5 2 M5 -7 l-.5 2 M9 -7.5 l0 2" stroke-width=".9"/>
  <path d="M-4 1 q4 3 8 0" fill="none" stroke-width="1.1"/>
  <path d="M-1 -4 l1 1" stroke-width=".9"/>
  <path d="M-18 -38 L22 -44 L13 -96 Z" fill="#F4E15A"/>
  <path d="M10 -95 l-1 -8 l4 4 l2 -7 l3 6 l4 -3 l-2 8 z" fill="#F4E15A"/>
  <path d="M2 -39 L3 -49 L8 -44 Q12 -46 15 -44 L19 -50 L20 -42 Z" fill="#141414"/>
  <rect x="-6" y="-66" width="11" height="8" fill="#FBF3C4" stroke-width="1" transform="rotate(-12 0 -62)"/>
  <path d="M-6 -66 l5.5 4.5 l5.5 -6" fill="none" stroke-width=".8" transform="rotate(-12 0 -62)"/>
 </g>
</g>

<!-- drawing: mini Zoi with brush -->
<g id="c-draw"><use href="#zoi-body" transform="translate(-2 0) scale(.44)"/>
 <g filter="url(#zp)" stroke="#2E2C29" stroke-width="1.1"><line x1="8" y1="8" x2="23" y2="-8" stroke="#B98A5A" stroke-width="2.6" stroke-linecap="round"/><path d="M23 -8 l5 -6 l1 4 z" fill="#2A4EFC"/></g></g>
<!-- out & eating: sushi with bow bag -->
<g id="c-sushi"><g filter="url(#zp)" stroke="#2E2C29" stroke-width="1.2" stroke-linejoin="round">
 <line x1="-8" y1="10" x2="-9" y2="20"/><line x1="8" y1="10" x2="9" y2="20"/>
 <line x1="18" y1="4" x2="26" y2="10"/>
 <path d="M22 12 q5 -9 10 0" fill="none"/><rect x="20" y="12" width="14" height="11" rx="2" fill="#EE9BC0"/>
 <path d="M27 14 l-5 -3 l0 6 z M27 14 l5 -3 l0 6 z" fill="#1F1E1C"/>
 <rect x="-20" y="-6" width="40" height="17" rx="7" fill="#FBF8F0"/>
 <path d="M-24 -6 Q-22 -18 0 -17 Q22 -18 25 -8 Q12 -4 -24 -6 Z" fill="#F4A06B"/>
 <path d="M-14 -15 l-3 6 M-4 -16 l-3 7 M6 -16 l-2 7 M15 -15 l-1 6" stroke="#FFF3EA" stroke-width="1.8"/>
 <use href="#eyes2" y="3"/>
</g></g>
<!-- reading: mini magician book -->
<g id="c-read"><g filter="url(#zp)" stroke="#2E2C29" stroke-width="1.2" stroke-linejoin="round">
 <line x1="-6" y1="18" x2="-8" y2="28"/><line x1="6" y1="18" x2="8" y2="28"/>
 <line x1="15" y1="2" x2="26" y2="-10" stroke-width="2.2"/><path d="M26 -10 l1.5 -4 l1.5 4 l4 .5 l-3 2.5 l1 4 l-3.5 -2 l-3.5 2 l1 -4 l-3 -2.5 z" fill="#F6D44A" stroke-width=".9"/>
 <rect x="-15" y="-18" width="30" height="36" fill="#C58BD9"/><rect x="-15" y="-18" width="5" height="36" fill="#9E6CB8"/>
 <rect x="-17" y="-21" width="34" height="4" fill="#1F1E1C"/><rect x="-10" y="-38" width="20" height="18" fill="#1F1E1C"/><rect x="-10" y="-26" width="20" height="3" fill="#E8574A" stroke="none"/>
 <use href="#eyes2" x="2" y="-5"/>
</g></g>
<!-- lazy day: two cats lying -->
<g id="c-lazy"><g transform="translate(-6 2) scale(.82)"><g filter="url(#zp)" stroke="#2E2C29" stroke-width="1.2" stroke-linejoin="round">
 <path d="M-30 10 Q-32 -4 -20 -6 L-21 -14 L-15 -8 Q-11 -9 -7 -8 L-2 -14 L-2 -5 Q4 -2 2 10 Z" fill="#141414"/>
 <path d="M-30 10 q-8 0 -8 -6" fill="none" stroke="#141414" stroke-width="3" stroke-linecap="round"/>
 <path d="M-20 -1 q2 1.5 4 0 M-12 -1 q2 1.5 4 0" fill="none" stroke="#E3DE84" stroke-width="1"/>
 <path d="M2 10 Q0 -4 12 -6 L11 -14 L17 -8 Q21 -9 25 -8 L30 -14 L30 -5 Q36 -2 34 10 Z" fill="#F7F1E2"/>
 <path d="M34 10 q8 0 8 -6" fill="none" stroke-width="1.2"/>
 <path d="M12 -1 q2 1.5 4 0 M20 -1 q2 1.5 4 0" fill="none" stroke-width="1"/>
 <path d="M30 -20 l5 0 l-5 5 l5 0" fill="none" stroke-width=".9"/>
</g></g></g>
<!-- Claude: original warm speech-bubble creature -->

<!-- ChatGPT: original cool square bubble creature -->

<!-- games: controller -->
<g id="c-game"><g filter="url(#zp)" stroke="#2E2C29" stroke-width="1.2" stroke-linejoin="round">
 <line x1="-8" y1="10" x2="-9" y2="20"/><line x1="8" y1="10" x2="9" y2="20"/>
 <path d="M-22 -2 Q-26 -14 -14 -14 L14 -14 Q26 -14 22 -2 Q20 14 12 12 Q8 6 0 6 Q-8 6 -12 12 Q-20 14 -22 -2 Z" fill="#A9C29A"/>
 <path d="M-15 -6 l6 0 M-12 -9 l0 6" stroke-width="1.6"/><circle cx="12" cy="-8" r="2" fill="#E8574A"/><circle cx="16" cy="-4" r="2" fill="#F6D44A"/>
 <use href="#eyes2" y="-3"/>
</g></g>
<!-- travel: suitcase -->
<g id="c-travel"><g filter="url(#zp)" stroke="#2E2C29" stroke-width="1.2" stroke-linejoin="round">
 <circle cx="-10" cy="17" r="3" fill="#2E2C29"/><circle cx="10" cy="17" r="3" fill="#2E2C29"/>
 <path d="M-7 -20 l0 -6 l14 0 l0 6" fill="none" stroke-width="1.6"/>
 <rect x="-18" y="-20" width="36" height="34" rx="4" fill="#F2C94C"/>
 <rect x="-14" y="2" width="10" height="7" fill="#2A4EFC" transform="rotate(-10 -9 5)"/><circle cx="10" cy="7" r="4" fill="#EE9BC0"/>
 <use href="#eyes2" y="-8"/>
</g></g>
<!-- shopping: parcel box -->


<!-- shopping: boutique bag -->
<g id="c-shop"><g filter="url(#zp)" stroke="#2E2C29" stroke-width="1.2" stroke-linejoin="round">
 <line x1="-7" y1="20" x2="-9" y2="30"/><line x1="7" y1="20" x2="9" y2="30"/>
 <path d="M-8 -14 q0 -14 8 -14 q8 0 8 14" fill="none" stroke="#1F1E1C" stroke-width="2"/>
 <path d="M-12 -14 l4 -8 l4 6 l4 -9 l4 8 l4 -7 l4 10" fill="#F3C6D3" stroke-width="1"/>
 <rect x="-16" y="-14" width="32" height="34" fill="#FBF8F0"/>
 <rect x="-12" y="-14" width="4" height="34" fill="#8FB0E8" stroke="none"/><rect x="-2" y="-14" width="4" height="34" fill="#8FB0E8" stroke="none"/><rect x="8" y="-14" width="4" height="34" fill="#8FB0E8" stroke="none"/>
 <rect x="-16" y="-14" width="32" height="34" fill="none"/>
 <rect x="-9" y="-4" width="18" height="12" fill="#FBF8F0" stroke-width=".9"/><use href="#eyes2" y="2"/>
</g></g>
<!-- Pen Pal: envelope in a blue shirt, glasses -->

<!-- Lines: blond boy, side bangs, blue tee -->


<!-- Pen Pal: orange alien, blue shirt, glasses -->
<g id="c-penpal"><g filter="url(#zp)" stroke="#2E2C29" stroke-width="1.2" stroke-linejoin="round">
 <line x1="-6" y1="15" x2="-7" y2="25"/><line x1="6" y1="15" x2="7" y2="25"/>
 <path d="M-6 -20 L-11 -31 M6 -20 L11 -31" fill="none"/><circle cx="-11" cy="-32" r="2.6" fill="#F2994A"/><circle cx="11" cy="-32" r="2.6" fill="#F2994A"/>
 <path d="M-17 -6 L-23 4 M17 -6 L23 4" stroke="#F2994A" stroke-width="4" stroke-linecap="round"/>
 <path d="M-17 -6 L-23 4 M17 -6 L23 4" fill="none" stroke-width="0"/>
 <ellipse cx="0" cy="-6" rx="17" ry="16" fill="#F2994A"/>
 <path d="M-15 2 Q0 6 15 2 L16 15 L-16 15 Z" fill="#7FA2E6"/>
 <path d="M-6 3 L0 9 L6 3 Z" fill="#FBF8F0"/><line x1="0" y1="9" x2="0" y2="15" stroke-width=".9"/>
 <circle cx="0" cy="12" r=".9" fill="#2E2C29"/>
 <circle cx="-6.5" cy="-9" r="5.8" fill="#fff"/><circle cx="6.5" cy="-9" r="5.8" fill="#fff"/><line x1="-.7" y1="-9" x2=".7" y2="-9"/>
 <circle cx="-5" cy="-8.4" r="2" fill="#141414" stroke="none"/><circle cx="8" cy="-8.4" r="2" fill="#141414" stroke="none"/>
 </g></g>
<!-- Lines: blond boy, center-parted line bangs, blue tee -->


<!-- friends: two dancing cells -->


<!-- Lines body in mini-Zoi coordinates -->
<g id="lines-body"><g filter="url(#zp)" stroke="#2E2C29" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
 <line x1="-7" y1="40" x2="-7.5" y2="56"/><line x1="7" y1="40" x2="7.5" y2="56"/>
 <ellipse cx="-9.5" cy="57.5" rx="5" ry="2.8" fill="#FBF8F0"/><ellipse cx="9.5" cy="57.5" rx="5" ry="2.8" fill="#FBF8F0"/>
 
 <line x1="-19" y1="22" x2="-22" y2="34"/><line x1="19" y1="22" x2="22" y2="34"/>
 <path d="M-12 8 L12 8 L22 17 L17 23 L13 19 L14 40 L-14 40 L-13 19 L-17 23 L-22 17 Z" fill="#4A68F2"/>
 <path d="M-21 -8 Q-21 -30 0 -31 Q21 -30 21 -8 Q21 9 0 10 Q-21 9 -21 -8 Z" fill="#F7F1E2"/>
 <path d="M-24.5 -2 Q-29 -38 0 -38.5 Q29 -38 24.5 -2 Q22 -13 16 -17 Q7 -21 2 -30 Q-3 -19 -13 -15.5 Q-21 -12.5 -24.5 -2 Z" fill="#E8C35A"/>
 <path d="M-14 -7 Q-9 -11 -3 -7 Q-9 -3.5 -14 -7 Z" fill="#fff"/>
 <path d="M3 -7 Q9 -11 14 -7 Q9 -3.5 3 -7 Z" fill="#fff"/>
 <ellipse cx="-6" cy="-7" rx="2.2" ry="2.6" fill="#141414" stroke="none"/><ellipse cx="11" cy="-7" rx="2.2" ry="2.6" fill="#141414" stroke="none"/>
 <path d="M-1 -1 l1 1" stroke-width=".9"/>
 <line x1="-3.5" y1="4" x2="3.5" y2="4" stroke-width="1.1"/>
</g></g>
<g id="c-lines"><use href="#lines-body" transform="translate(0 2) scale(.56)"/></g>
<!-- friends: a circle and a triangle dancing -->
<g id="c-friends"><g filter="url(#zp)" stroke="#2E2C29" stroke-width="1.2" stroke-linejoin="round">
 <path d="M-16 13 l-5 10 M-8 14 l2 9 M10 15 l-3 9 M19 15 l5 8" fill="none"/>
 <path d="M-24 -4 L-31 -18 M23 -4 L30 -17" fill="none"/>
 <path d="M-6 0 Q0 -6 6 -1" fill="none"/>
 <circle cx="-14" cy="0" r="14" fill="#EE9BC0"/>
 <path d="M2 15 L28 15 L15 -20 Z" fill="#F6D44A"/>
 <use href="#eyes2" x="-14" y="-3"/><use href="#eyes2" x="15" y="2" transform="rotate(0)"/>
 <path d="M-31 -24 l2 -3 l2 3 M30 -24 l1 -4 l3 2" fill="none" stroke-width=".9"/>
 <circle cx="-2" cy="-20" r="1.6" fill="#2A4EFC" stroke="none"/><circle cx="4" cy="-27" r="1.4" fill="#E8574A" stroke="none"/><circle cx="-4" cy="-30" r="1.2" fill="#A9C29A" stroke="none"/>
</g></g>
</defs></svg>`;
export const ROAD = `<svg class="road" viewBox="0 0 400 1490" role="img" aria-label="The road: seven creatures and a little house">
    <defs>
      <filter id="pencil" x="-8%" y="-8%" width="116%" height="116%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="d"/>
        <feTurbulence type="fractalNoise" baseFrequency="1.7" numOctaves="1" seed="9" result="g"/>
        <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.9 0 0 0 1.32" result="ga"/>
        <feComposite in="d" in2="ga" operator="in"/>
      </filter>
      <pattern id="dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.05" fill="#E0457B"/></pattern>
      <pattern id="dotsB" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill="#4F9BD9"/></pattern>
    </defs>

    <path class="path" d="M200 0 C200 70,172 80,172 140 S228 250,228 310 S172 420,172 480 S228 590,228 650 S172 760,172 820 S228 930,228 990 S172 1100,172 1160 S200 1240,200 1282" fill="none" stroke="#141414" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="0.1 7"/>
    <circle class="start" cx="200" cy="2" r="5" fill="#2A4EFC"/>

    <!-- 01 Days : bagel -->
    <g class="crt" data-k="days" transform="translate(95 105)">
      <rect class="hit" x="-66" y="-60" width="132" height="185"/>
      <g class="bob df"><g filter="url(#pencil)" stroke="#2E2C29" stroke-width="1.4">
        <line x1="-18" y1="38" x2="-23" y2="57"/><line x1="18" y1="38" x2="23" y2="57"/>
        <circle cx="-24" cy="59" r="4.5" fill="#EC9A5F"/><circle cx="24" cy="59" r="4.5" fill="#EC9A5F"/>
        <ellipse cx="0" cy="0" rx="58" ry="42" fill="#EC9A5F"/>
        <ellipse cx="-6" cy="-14" rx="40" ry="20" fill="#F2B27F" stroke="none"/>
        <ellipse cx="0" cy="13" rx="15" ry="7" fill="#EEEBE3"/>
        <g stroke="none"><g fill="#FBF6EA"><ellipse cx="-38" cy="2" rx="3" ry="1.5" transform="rotate(-20 -38 2)"/><ellipse cx="30" cy="25" rx="3" ry="1.5" transform="rotate(-30 30 25)"/><ellipse cx="-30" cy="-22" rx="3" ry="1.5" transform="rotate(40 -30 -22)"/><ellipse cx="44" cy="-6" rx="3" ry="1.5" transform="rotate(70 44 -6)"/><ellipse cx="-14" cy="30" rx="3" ry="1.5" transform="rotate(10 -14 30)"/></g><g fill="#2E2C29"><circle cx="40" cy="8" r="1.3"/><circle cx="-28" cy="24" r="1.3"/><circle cx="2" cy="-33" r="1.3"/><circle cx="33" cy="-21" r="1.3"/><circle cx="-46" cy="-8" r="1.3"/><circle cx="14" cy="32" r="1.3"/></g></g>
        <g class="eyes"><circle cx="-12" cy="-12" r="8" fill="#fff"/><circle cx="12" cy="-12" r="8" fill="#fff"/><circle cx="-9" cy="-11" r="3.2" fill="#141414" stroke="none"/><circle cx="15" cy="-11" r="3.2" fill="#141414" stroke="none"/></g>
      </g></g>
      <g class="bob nf"><rect class="hit" x="-70" y="-200" width="140" height="262"/><g transform="translate(0 62) scale(.62) translate(-181 -642)"><!-- BAGEL full form -->
<g filter="url(#zglow)"><g filter="url(#zpn)">
 <path d="M150 380 Q118 455 138 520 Q146 560 132 640" fill="none" stroke="#1A2C9E" stroke-width="15" stroke-linecap="round"/>
 <path d="M212 380 Q238 455 222 520 Q212 562 232 640" fill="none" stroke="#1A2C9E" stroke-width="15" stroke-linecap="round"/>
 <path d="M132 640 q-22 6 -40 2 q16 -10 34 -12 M232 640 q24 6 42 1 q-16 -10 -36 -11" fill="#0A0C18" stroke="#3B57F2" stroke-width="2"/>
 <path d="M96 300 Q70 380 82 455 l-8 14 M82 455 l2 16 M82 455 l9 12" fill="none" stroke="#2340E8" stroke-width="6" stroke-linecap="round"/>
 <path d="M266 300 Q292 380 280 455 l8 14 M280 455 l-2 16 M280 455 l-9 12" fill="none" stroke="#2340E8" stroke-width="6" stroke-linecap="round"/>
 <ellipse cx="181" cy="310" rx="96" ry="76" fill="#2340E8" stroke="#8FA6FF" stroke-width="2"/>
 <ellipse cx="170" cy="286" rx="62" ry="30" fill="#3B5CF6" opacity=".7"/>
 <ellipse cx="181" cy="330" rx="34" ry="19" fill="#05060D" stroke="#8FA6FF" stroke-width="2"/>
 <path d="M153 322 l5 9 l5 -10 l5 10 l5 -10 l5 10 l5 -10 l5 10 l5 -10 l5 9" fill="#F4F1E6" stroke="none"/>
 <path d="M158 340 l5 -7 l5 8 l5 -8 l5 8 l5 -8 l5 8 l5 -7" fill="#F4F1E6" stroke="none"/>
 <g fill="#F4F1E6"><ellipse cx="110" cy="300" rx="4" ry="2" transform="rotate(-30 110 300)"/><ellipse cx="250" cy="316" rx="4" ry="2" transform="rotate(30 250 316)"/><ellipse cx="140" cy="370" rx="4" ry="2"/><ellipse cx="226" cy="368" rx="4" ry="2" transform="rotate(-20 226 368)"/><ellipse cx="208" cy="248" rx="4" ry="2" transform="rotate(20 208 248)"/></g>
 <g stroke="#05060D" stroke-width="1.6">
  <path d="M128 276 Q143 262 158 276 Q143 288 128 276 Z" fill="#E9FF5A"/><ellipse cx="143" cy="276" rx="2.4" ry="6" fill="#05060D"/>
  <path d="M196 268 Q212 252 228 268 Q212 281 196 268 Z" fill="#E9FF5A"/><ellipse cx="212" cy="268" rx="2.4" ry="6.5" fill="#05060D"/>
  <path d="M232 306 Q242 297 252 306 Q242 313 232 306 Z" fill="#E9FF5A"/><ellipse cx="242" cy="306" rx="1.6" ry="4" fill="#05060D"/>
  <path d="M100 330 Q110 321 120 330 Q110 337 100 330 Z" fill="#E9FF5A"/><ellipse cx="110" cy="330" rx="1.6" ry="4" fill="#05060D"/>
  <path d="M168 244 Q176 237 184 244 Q176 250 168 244 Z" fill="#E9FF5A"/><ellipse cx="176" cy="244" rx="1.4" ry="3.4" fill="#05060D"/>
 </g>
</g></g>
</g></g>
      <text class="lt" x="-65" y="98">Days<tspan class="n" dx="3" dy="-11">01</tspan></text>
      <text class="ld" x="-65" y="116"><tspan class="ldt">Days</tspan>, 2026.<tspan x="-65" dy="12.5">Bagel, sesame, poppy seed.</tspan><tspan x="-65" dy="12.5">365 seeds, ongoing.</tspan></text>
    </g>

    <!-- 02 Party Hat -->
    <g class="crt" data-k="hat" transform="translate(305 275)">
      <rect class="hit" x="-66" y="-75" width="132" height="200"/>
      <g class="bob df"><g filter="url(#pencil)" stroke="#2E2C29" stroke-width="1.4">
        <line x1="-14" y1="46" x2="-18" y2="58"/><line x1="14" y1="46" x2="18" y2="58"/>
        <path d="M-24 60 l10 0 l-4 -6z" fill="#F3C6D3"/><path d="M14 60 l10 0 l-6 -6z" fill="#F3C6D3"/>
        <path d="M-42 46 L40 46 L10 -60 Z" fill="#F7E87A" stroke-linejoin="round"/>
        <path d="M6 -60 l-2 -9 l5 5 l3 -8 l3 8 l5 -5 l-3 9 z" fill="#F7E87A"/>
        <rect x="-26" y="12" width="16" height="11" fill="#FBF3C4" transform="rotate(-14 -18 17)"/>
        <path d="M-26 13 l8 6 l7 -8" fill="none" stroke-width="1" transform="rotate(-14 -18 17)"/>
        <path d="M4 46 L6 30 L13 38 Q19 34 25 38 L31 30 L33 46 Z" fill="#141414"/>
        <g class="eyes"><circle cx="-6" cy="-8" r="6.5" fill="#fff"/><circle cx="10" cy="-8" r="6.5" fill="#fff"/><circle cx="-6" cy="-11" r="2.7" fill="#141414" stroke="none"/><circle cx="10" cy="-11" r="2.7" fill="#141414" stroke="none"/></g>
      </g></g>
      <g class="bob nf"><rect class="hit" x="-60" y="-200" width="120" height="262"/><g transform="translate(0 62) scale(.46) translate(-476 -652)"><!-- PARTY HAT full form -->
<g filter="url(#zglow)"><g filter="url(#zpn)">
 <path d="M452 470 Q430 540 446 600 Q450 625 438 652" fill="none" stroke="#C2301E" stroke-width="16" stroke-linecap="round"/>
 <path d="M500 470 Q524 540 508 600 Q504 625 520 652" fill="none" stroke="#C2301E" stroke-width="16" stroke-linecap="round"/>
 <path d="M438 652 q-18 4 -30 0 M520 652 q18 4 30 -1" stroke="#7A1410" stroke-width="7" stroke-linecap="round"/>
 <path d="M440 352 Q404 320 400 268 Q398 240 392 214" fill="none" stroke="#D9381F" stroke-width="13" stroke-linecap="round"/>
 <path d="M512 352 Q548 316 552 262 Q554 236 562 210" fill="none" stroke="#D9381F" stroke-width="13" stroke-linecap="round"/>
 <path d="M392 214 l-12 -20 M392 214 l-4 -24 M392 214 l6 -22 M392 214 l14 -16 M562 210 l-12 -18 M562 210 l-3 -24 M562 210 l7 -22 M562 210 l15 -14" stroke="#F06A3A" stroke-width="4.5" stroke-linecap="round"/>
 <path d="M428 350 Q476 336 522 350 Q540 400 512 476 Q476 490 442 476 Q414 410 428 350 Z" fill="#D9381F" stroke="#FF8A5C" stroke-width="2"/>
 <path d="M452 392 q22 12 46 0 M456 420 q20 10 40 0 M460 446 q16 8 32 0" fill="none" stroke="#8E1E12" stroke-width="3"/>
 <path d="M430 352 Q476 362 522 352 L506 368 Q476 376 446 368 Z" fill="#1B6B5A" stroke="none"/>
 <path d="M446 352 L506 352 L486 150 Q478 120 470 150 Z" fill="#F2DC2A" stroke="#FFF59A" stroke-width="2"/>
 <path d="M472 132 l-4 -16 l7 7 l4 -14 l5 13 l7 -6 l-4 16 z" fill="#F2DC2A" stroke="#FFF59A" stroke-width="1.5"/>
 <path d="M458 300 Q467 290 476 300 Q467 306 458 300 Z" fill="#C2301E" stroke="#05060D" stroke-width="1.2"/>
 <path d="M478 300 Q487 290 496 300 Q487 306 478 300 Z" fill="#C2301E" stroke="#05060D" stroke-width="1.2"/>
 <circle cx="467" cy="300" r="2" fill="#05060D"/><circle cx="487" cy="300" r="2" fill="#05060D"/>
 <path d="M470 322 q7 -4 14 0 q-7 6 -14 0 z" fill="#C2301E"/>
 <path d="M520 346 q-2 -20 10 -24 l-2 -12 l8 8 q5 -2 10 0 l8 -8 l-2 12 q12 6 8 24 z" fill="#05060D" stroke="#3B57F2" stroke-width="1.5"/>
 <ellipse cx="533" cy="330" rx="3" ry="2.4" fill="#E9FF5A"/><ellipse cx="545" cy="330" rx="3" ry="2.4" fill="#E9FF5A"/>
 <g transform="rotate(-18 430 120)"><rect x="414" y="108" width="34" height="24" fill="#F4F1E6"/><path d="M414 108 l17 13 l17 -13" fill="none" stroke="#C2301E" stroke-width="2"/></g>
</g></g>
</g></g>
      <text class="lt" x="-60" y="98">Party Hat<tspan class="n" dx="3" dy="-11">02</tspan></text>
      <text class="ld" x="-60" y="116"><tspan class="ldt">Party Hat</tspan>, 2026.<tspan x="-60" dy="12.5">Paper, glue, one envelope,</tspan><tspan x="-60" dy="12.5">a cat who wasn’t invited.</tspan></text>
    </g>

    <!-- 03 Wishes : willow -->
    <g class="crt" data-k="wishes" transform="translate(95 450)">
      <rect class="hit" x="-66" y="-75" width="132" height="200"/>
      <g class="bob"><g filter="url(#pencil)">
        <line x1="-4" y1="42" x2="-10" y2="58" stroke="#2E2C29" stroke-width="1.4"/><line x1="4" y1="42" x2="10" y2="58" stroke="#2E2C29" stroke-width="1.4"/>
        <path d="M0 44 L0 2 Q-2 -26 -24 -58 M0 2 Q4 -24 28 -52" fill="none" stroke="#2E2C29" stroke-width="11" stroke-linecap="round"/>
        <path d="M0 44 L0 2 Q-2 -26 -24 -58 M0 2 Q4 -24 28 -52" fill="none" stroke="#DCCBA2" stroke-width="8" stroke-linecap="round"/>
        <g stroke="#2E2C29" stroke-width="1.1">
          <ellipse cx="-30" cy="-48" rx="4.5" ry="14" fill="#86C97E" transform="rotate(-38 -30 -48)"/>
          <ellipse cx="-6" cy="-40" rx="4.5" ry="13" fill="#86C97E" transform="rotate(28 -6 -40)"/>
          <ellipse cx="36" cy="-44" rx="4.5" ry="14" fill="#EBD98C" transform="rotate(38 36 -44)"/>
          <ellipse cx="14" cy="-34" rx="4.5" ry="13" fill="#86C97E" transform="rotate(-26 14 -34)"/>
          <ellipse cx="-16" cy="-14" rx="4" ry="11" fill="#86C97E" transform="rotate(-60 -16 -14)"/>
        </g>
        <path d="M-8 24 l4 -3.5 l4 3.5 l4 -3.5 l4 3.5" fill="none" stroke="#2E2C29" stroke-width="1.1"/>
        <g class="eyes" stroke="#2E2C29" stroke-width="1.2"><circle cx="-8" cy="4" r="7" fill="#fff"/><circle cx="9" cy="4" r="7" fill="#fff"/><circle cx="-7" cy="1" r="2.8" fill="#141414" stroke="none"/><circle cx="10" cy="1" r="2.8" fill="#141414" stroke="none"/></g>
      </g></g>
      <text class="lt" x="-65" y="98">Wishes<tspan class="n" dx="3" dy="-11">03</tspan></text>
      <text class="ld" x="-65" y="116"><tspan class="ldt">Wishes</tspan>, 2026.<tspan x="-65" dy="12.5">Willow twig, patience.</tspan><tspan x="-65" dy="12.5">No takebacks.</tspan></text>
    </g>

    <!-- 04 Looks : CDG dress -->
    <g class="crt" data-k="looks" transform="translate(305 620)">
      <rect class="hit" x="-66" y="-75" width="132" height="200"/>
      <g class="bob"><g filter="url(#pencil)" stroke="#2E2C29" stroke-width="1.4">
        <line x1="-12" y1="48" x2="-14" y2="58"/><line x1="12" y1="48" x2="14" y2="58"/>
        <path d="M-20 61 l12 0 l-5 -7z" fill="#F3C6D3"/><path d="M8 61 l12 0 l-7 -7z" fill="#F3C6D3"/>
        <path d="M-13 -40 L13 -40 Q19 0 40 44 Q0 56 -40 44 Q-19 0 -13 -40 Z" fill="#1F1E1C"/>
        <path d="M-6 -42 L-16 -10 M6 -42 L17 -12" stroke="#1F1E1C" stroke-width="6" stroke-linecap="round"/>
        <ellipse cx="-22" cy="-50" rx="23" ry="13" fill="#1F1E1C" transform="rotate(-16 -22 -50)"/>
        <ellipse cx="22" cy="-50" rx="23" ry="13" fill="#1F1E1C" transform="rotate(16 22 -50)"/>
        <path d="M-30 -52 q8 -4 16 0 M14 -52 q8 -4 16 0" fill="none" stroke="#4A4744" stroke-width="1"/>
        <circle cx="0" cy="-47" r="7.5" fill="#2E2C29" stroke="#4A4744"/>
        <g class="eyes"><circle cx="-9" cy="-4" r="7.5" fill="#fff"/><circle cx="10" cy="-4" r="7.5" fill="#fff"/><circle cx="-12" cy="-3" r="3" fill="#141414" stroke="none"/><circle cx="7" cy="-3" r="3" fill="#141414" stroke="none"/></g>
      </g></g>
      <text class="lt" x="-60" y="98">Looks<tspan class="n" dx="3" dy="-11">04</tspan></text>
      <text class="ld" x="-60" y="116"><tspan class="ldt">Looks</tspan>, 2026.<tspan x="-60" dy="12.5">Black cotton, one big bow,</tspan><tspan x="-60" dy="12.5">strong opinions.</tspan></text>
    </g>

    <!-- 05 Cauldron -->
    <g class="crt" data-k="cauldron" id="crt-cauldron" transform="translate(95 790)">
      <rect class="hit" x="-66" y="-95" width="132" height="220"/>
      <g class="bob"><g filter="url(#pencil)" stroke="#2E2C29" stroke-width="1.4" stroke-linejoin="round">
        <path d="M-16 40 L-20 58 M16 40 L20 58" stroke="#2E2C29" stroke-width="7.5" stroke-linecap="round"/>
        <path d="M-16 40 L-20 58 M16 40 L20 58" stroke="#FBF8F0" stroke-width="5" stroke-linecap="round"/>
        <path d="M-16 40 L-20 58 M16 40 L20 58" stroke="#2A4EFC" stroke-width="5" stroke-dasharray="2.6 3" stroke-linecap="butt"/>
        <path d="M-17 58 Q-22 64 -34 60 Q-30 56 -23 56 Z" fill="#141414"/>
        <path d="M17 58 Q22 64 34 60 Q30 56 23 56 Z" fill="#141414"/>
        <path d="M-22 -22 L-44 -58" stroke="#2E2C29" stroke-width="6" stroke-linecap="round"/>
        <path d="M-22 -22 L-44 -58" stroke="#DCCBA2" stroke-width="3.6" stroke-linecap="round"/>
        <ellipse cx="0" cy="10" rx="47" ry="37" fill="#6F8BA8"/>
        <ellipse cx="0" cy="-20" rx="50" ry="10" fill="#8BA3BC"/>
        <ellipse cx="0" cy="-20" rx="41" ry="6" fill="#CFE0B4"/>
        <path d="M10 -20 a6 5 0 0 1 12 0 z" fill="#fff" stroke-width="1"/><circle cx="16" cy="-22" r="2" fill="#2A4EFC" stroke="none"/>
        <g class="fl f1"><circle cx="-14" cy="-42" r="9" fill="#DCE7F5"/><path d="M-14 -46.5 l1.3 3 l3.2 .3 l-2.4 2.1 l.8 3.1 l-2.9 -1.7 l-2.9 1.7 l.8 -3.1 l-2.4 -2.1 l3.2 -.3 z" fill="#F6E21C" stroke-width=".7"/></g>
        <g class="fl f2"><circle cx="16" cy="-60" r="15" fill="#DCE7F5"/>
          <g class="eyes"><path d="M7 -60 Q16 -68 25 -60 Q16 -52 7 -60 Z" fill="#fff" stroke-width="1"/><circle cx="18" cy="-60" r="3.4" fill="#E0457B" stroke="none"/><circle cx="18" cy="-60" r="1.5" fill="#141414" stroke="none"/></g>
          <path d="M6 -68 q3 -5 8 -6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></g>
        <g class="fl f3"><circle cx="-2" cy="-84" r="6" fill="#DCE7F5"/><path d="M-5 -84 q1.5 -2 3 0 t3 0" fill="none" stroke-width=".9"/></g>
        <g class="eyes"><circle cx="-14" cy="10" r="8" fill="#fff"/><circle cx="14" cy="10" r="8" fill="#fff"/><circle cx="-12" cy="6" r="3.2" fill="#141414" stroke="none"/><circle cx="16" cy="6" r="3.2" fill="#141414" stroke="none"/></g>
      </g></g>
      <text class="lt" x="-65" y="98">Cauldron<tspan class="n" dx="3" dy="-11">05</tspan></text>
      <text class="ld" x="-65" y="116"><tspan class="ldt">Cauldron</tspan>, 2026.<tspan x="-65" dy="12.5">Cast iron, striped socks,</tspan><tspan x="-65" dy="12.5">loose thoughts. Still bubbling.</tspan></text>
    </g>

    <!-- 06 Shelf -->
    <g class="crt" data-k="shelf" transform="translate(305 960)">
      <rect class="hit" x="-66" y="-90" width="132" height="215"/>
      <g class="bob"><g filter="url(#pencil)" stroke="#2E2C29" stroke-width="1.3">
        <line x1="-36" y1="52" x2="-38" y2="60"/><line x1="36" y1="52" x2="38" y2="60"/>
        <rect x="-48" y="-52" width="96" height="104" fill="#E8D3B4"/>
        <rect x="-42" y="-46" width="24" height="92" fill="#F4ECDD"/>
        <rect x="-12" y="-46" width="54" height="42" fill="#F4ECDD"/>
        <rect x="-12" y="4" width="54" height="42" fill="#F4ECDD"/>
        <g stroke-width="0.9">
          <rect x="-40" y="-30" width="5" height="76" fill="#F3C6D3"/><rect x="-35" y="-22" width="6" height="68" fill="#CADBF2"/><rect x="-29" y="-34" width="5" height="80" fill="#F2DDA8"/><rect x="-24" y="-26" width="4" height="72" fill="#86C97E"/>
          <rect x="-10" y="-30" width="5" height="26" fill="#F2C09A"/><rect x="-5" y="-26" width="5" height="22" fill="#D9CCE8"/><rect x="0" y="-32" width="6" height="28" fill="#CADBF2"/><rect x="6" y="-27" width="4" height="23" fill="#F3C6D3"/><rect x="10" y="-30" width="5" height="26" fill="#2A4EFC"/>
          <rect x="-10" y="20" width="6" height="26" fill="#86C97E"/><rect x="-4" y="16" width="5" height="30" fill="#F2DDA8"/><rect x="1" y="22" width="5" height="24" fill="#F3C6D3"/><rect x="6" y="18" width="4" height="28" fill="#D9CCE8"/>
        </g>
        <rect id="shelf-top" x="-16" y="-84" width="34" height="32" fill="#F3C6D3"/>
        <g class="eyes"><circle cx="-7" cy="-68" r="6" fill="#fff"/><circle cx="9" cy="-68" r="6" fill="#fff"/><circle cx="-9" cy="-66" r="2.5" fill="#141414" stroke="none"/><circle cx="7" cy="-66" r="2.5" fill="#141414" stroke="none"/></g>
      </g></g>
      <text class="lt" x="-60" y="98">Shelf<tspan class="n" dx="3" dy="-11">06</tspan></text>
      <text class="ld" x="-60" y="116"><tspan class="ldt">Shelf</tspan>, 2026.<tspan x="-60" dy="12.5">Oak, picture books,</tspan><tspan x="-60" dy="12.5">most of them unread.</tspan></text>
    </g>

    <!-- 07 Grimoire : riso -->
    <g class="crt" data-k="grimoire" transform="translate(95 1130)">
      <rect class="hit" x="-66" y="-70" width="132" height="195"/>
      <g class="bob"><g filter="url(#pencil)">
        <line x1="-16" y1="50" x2="-18" y2="60" stroke="#2E2C29" stroke-width="1.4"/><line x1="16" y1="50" x2="18" y2="60" stroke="#2E2C29" stroke-width="1.4"/>
        <g transform="scale(-1 1)"><path d="M40 -22 q30 -18 44 -8 q-12 4 -16 10 q10 0 14 6 q-14 2 -20 8 q8 2 10 8 q-18 2 -32 -6 z" fill="#F3EEF8" stroke="#2E2C29" stroke-width="1.2"/>
        <path d="M44 -4 q16 -1 28 -12" fill="none" stroke="url(#dotsB)" stroke-width="4"/></g>
        <rect x="-40" y="-48" width="84" height="100" rx="4" fill="none" stroke="#E0457B" stroke-width="2.2" transform="translate(3 2)"/>
        <rect x="-42" y="-50" width="84" height="100" rx="4" fill="#3B2466" stroke="#2E2C29" stroke-width="1.3"/>
        <rect x="-42" y="-50" width="10" height="100" fill="#2A1A4C"/>
        <rect x="-30" y="16" width="68" height="30" fill="url(#dots)" opacity=".7"/>
        <path d="M-24 -2 Q0 -26 24 -2 Q0 22 -24 -2 Z" fill="#F3EEF8"/>
        <g class="eyes"><circle cx="0" cy="-2" r="10" fill="#E0457B"/><circle cx="0" cy="-2" r="4.5" fill="#141414"/><circle cx="2" cy="-4" r="1.4" fill="#F3EEF8"/></g>
        <path d="M0 -36 l2 6 l6 0 l-5 4 l2 6 l-5 -4 l-5 4 l2 -6 l-5 -4 l6 0 z" fill="#4F9BD9"/>
        <path d="M-22 30 l1.5 4 l4 0 l-3 2.5 l1 4 l-3.5 -2.5 l-3.5 2.5 l1 -4 l-3 -2.5 l4 0 z" fill="#F3EEF8"/>
      </g></g>
      <text class="lt" x="-65" y="98">Grimoire<tspan class="n" dx="3" dy="-11">07</tspan></text>
      <text class="ld" x="-65" y="116"><tspan class="ldt">Grimoire</tspan>, 2026.<tspan x="-65" dy="12.5">Ink, one eye, one wing.</tspan><tspan x="-65" dy="12.5">Kept by Zi.</tspan></text>
    </g>

    <!-- Home : house + Juno + Jupiter -->
    <g class="crt" data-k="home" transform="translate(200 1340)">
      <rect class="hit" x="-130" y="-70" width="260" height="215"/>
      <g class="bob"><g filter="url(#pencil)" stroke="#2E2C29" stroke-width="1.4">
        <polygon points="-74,0 74,0 0,-62" fill="#BFD6EC" stroke-linejoin="round"/>
        <rect x="-58" y="0" width="116" height="70" fill="#F2C09A"/>
        <path d="M-14 70 L-14 44 Q0 26 14 44 L14 70" fill="#F6DC92"/>
        <rect x="-48" y="12" width="24" height="22" rx="5" fill="#F6DC92"/>
        <rect x="24" y="12" width="24" height="22" rx="5" fill="#F6DC92"/>
        <g class="eyes"><circle cx="-36" cy="23" r="6.5" fill="#fff"/><circle cx="36" cy="23" r="6.5" fill="#fff"/><circle cx="-33" cy="24" r="2.7" fill="#141414" stroke="none"/><circle cx="39" cy="24" r="2.7" fill="#141414" stroke="none"/></g>
      </g></g>
      <g class="bob cat" id="cat-juno"><g filter="url(#pencil)">
        <path d="M78 70 Q74 40 86 34 L84 18 L94 28 Q100 26 106 28 L116 18 L114 34 Q126 40 122 70 Z" fill="#141414"/>
        <path d="M120 66 q16 -2 12 -18" fill="none" stroke="#141414" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="94" cy="40" rx="3.4" ry="2.6" fill="#E3DE84"/><ellipse cx="106" cy="40" rx="3.4" ry="2.6" fill="#E3DE84"/>
        <ellipse cx="95" cy="40" rx="1.2" ry="2.2" fill="#141414"/><ellipse cx="107" cy="40" rx="1.2" ry="2.2" fill="#141414"/>
      </g></g>
      <g class="bob cat" id="cat-jupiter"><g filter="url(#pencil)" stroke="#2E2C29" stroke-width="1.3">
        <path d="M-124 70 q-6 -14 2 -26 q-6 -6 0 -12 L-122 16 L-112 26 Q-106 24 -100 26 L-90 16 L-92 32 q6 6 0 12 q8 12 2 26 Z" fill="#F7F1E2" stroke-linejoin="round"/>
        <path d="M-90 64 q18 2 16 -14" fill="none" stroke-width="1.3"/>
        <ellipse cx="-112" cy="38" rx="3.2" ry="2.4" fill="#E3DE84"/><ellipse cx="-100" cy="38" rx="3.2" ry="2.4" fill="#E3DE84"/>
        <ellipse cx="-111" cy="38" rx="1.1" ry="2" fill="#141414" stroke="none"/><ellipse cx="-99" cy="38" rx="1.1" ry="2" fill="#141414" stroke="none"/>
        <path d="M-108 34 q2 -2 4 0" fill="none" stroke-width="1"/>
      </g></g>
      <text class="lt" x="0" y="112" text-anchor="middle">Home</text>
      <text class="ld" x="0" y="132" text-anchor="middle"><tspan class="ldt">Home</tspan>, 2026.<tspan x="0" dy="12.5">Cardboard, two cats, lights left on.</tspan></text>
    </g>
    <g class="river" filter="url(#pencil)"><path class="rv rv0" transform="translate(-15 0)" d="M200 0 C200 70,172 80,172 140 S228 250,228 310 S172 420,172 480 S228 590,228 650 S172 760,172 820 S228 930,228 990 S172 1100,172 1160 S200 1240,200 1282" fill="none" stroke="#2340E8" stroke-width="4" stroke-linecap="round"/><path class="rv rv1" transform="translate(-10 0)" d="M200 0 C200 70,172 80,172 140 S228 250,228 310 S172 420,172 480 S228 590,228 650 S172 760,172 820 S228 930,228 990 S172 1100,172 1160 S200 1240,200 1282" fill="none" stroke="#1FA58A" stroke-width="5" stroke-linecap="round"/><path class="rv rv2" transform="translate(-5 0)" d="M200 0 C200 70,172 80,172 140 S228 250,228 310 S172 420,172 480 S228 590,228 650 S172 760,172 820 S228 930,228 990 S172 1100,172 1160 S200 1240,200 1282" fill="none" stroke="#C6FF3D" stroke-width="5.5" stroke-linecap="round"/><path class="rv rv3" transform="translate(0 0)" d="M200 0 C200 70,172 80,172 140 S228 250,228 310 S172 420,172 480 S228 590,228 650 S172 760,172 820 S228 930,228 990 S172 1100,172 1160 S200 1240,200 1282" fill="none" stroke="#F2C230" stroke-width="6" stroke-linecap="round"/><path class="rv rv4" transform="translate(5 0)" d="M200 0 C200 70,172 80,172 140 S228 250,228 310 S172 420,172 480 S228 590,228 650 S172 760,172 820 S228 930,228 990 S172 1100,172 1160 S200 1240,200 1282" fill="none" stroke="#F07A2A" stroke-width="5.5" stroke-linecap="round"/><path class="rv rv5" transform="translate(10 0)" d="M200 0 C200 70,172 80,172 140 S228 250,228 310 S172 420,172 480 S228 590,228 650 S172 760,172 820 S228 930,228 990 S172 1100,172 1160 S200 1240,200 1282" fill="none" stroke="#E03A2A" stroke-width="5" stroke-linecap="round"/><path class="rv rv6" transform="translate(15 0)" d="M200 0 C200 70,172 80,172 140 S228 250,228 310 S172 420,172 480 S228 590,228 650 S172 760,172 820 S228 930,228 990 S172 1100,172 1160 S200 1240,200 1282" fill="none" stroke="#2340E8" stroke-width="4" stroke-linecap="round"/><path class="rvs" transform="translate(-4 0)" d="M200 0 C200 70,172 80,172 140 S228 250,228 310 S172 420,172 480 S228 590,228 650 S172 760,172 820 S228 930,228 990 S172 1100,172 1160 S200 1240,200 1282" fill="none" stroke="#FFF7C2" stroke-width="2.2" stroke-linecap="round" opacity=".8"/><path class="rvs rvs2" transform="translate(7 0)" d="M200 0 C200 70,172 80,172 140 S228 250,228 310 S172 420,172 480 S228 590,228 650 S172 760,172 820 S228 930,228 990 S172 1100,172 1160 S200 1240,200 1282" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" opacity=".6"/></g><g id="walker"><g id="walker-in"><use href="#zoi-body" transform="translate(0 -26) scale(.42)"/></g></g><circle class="ff" cx="40" cy="60" r="2.2" style="animation-delay:0s"/><circle class="ff" cx="350" cy="190" r="2.2" style="animation-delay:0.8s"/><circle class="ff" cx="250" cy="420" r="2.2" style="animation-delay:1.6s"/><circle class="ff" cx="30" cy="560" r="2.2" style="animation-delay:0.4s"/><circle class="ff" cx="360" cy="740" r="2.2" style="animation-delay:2.1s"/><circle class="ff" cx="220" cy="880" r="2.2" style="animation-delay:1.2s"/><circle class="ff" cx="20" cy="1010" r="2.2" style="animation-delay:2.6s"/><circle class="ff" cx="330" cy="1180" r="2.2" style="animation-delay:0.6s"/><circle class="ff" cx="60" cy="1250" r="2.2" style="animation-delay:1.9s"/><circle class="ff" cx="300" cy="1400" r="2.2" style="animation-delay:1s"/>
  </svg>`;
export const TAGS = [
  { id: 'draw', label: 'Drawing', group: 'MAKE' },
  { id: 'lines', label: 'Lines', group: 'MAKE' },
  { id: 'penpal', label: 'Pen Pal', group: 'MAKE' },
  { id: 'read', label: 'Reading', group: 'MAKE' },
  { id: 'sushi', label: 'Out & eating', group: 'PLAY' },
  { id: 'show', label: 'Shows & films', group: 'PLAY' },
  { id: 'game', label: 'Games', group: 'PLAY' },
  { id: 'travel', label: 'Travel', group: 'PLAY' },
  { id: 'shop', label: 'Shopping', group: 'LIVE' },
  { id: 'outfit', label: 'Good outfit', group: 'LIVE' },
  { id: 'friends', label: 'Friends', group: 'LIVE' },
  { id: 'lazy', label: 'Lazy day', group: 'LIVE' },
];
export function tagSVG(id, size = 56) {
  return `<svg class="tagsvg" viewBox="-40 -42 80 80" width="${size}" height="${size}" aria-hidden="true"><use href="#c-${id}"/></svg>`;
}
