const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const welcome = $("#welcome"), scrapbook = $("#scrapbook"), envelope = $("#envelope");
let currentPage = 0;
const pages = $$(".page-content");
const dots = $$(".dot");

function openBook(){
  envelope.classList.add("open");
  $("#openBtn").disabled = true;
  $("#openBtn").textContent = "Opening your memories…";
  setTimeout(()=>{
    welcome.classList.add("hidden");
    scrapbook.classList.remove("hidden");
    showPage(0);
    window.scrollTo({top:0,behavior:"smooth"});
  },850);
}
$("#openBtn").addEventListener("click",openBook);
envelope.addEventListener("click",openBook);

function showPage(index){
  currentPage = Math.max(0,Math.min(pages.length-1,index));
  pages.forEach((p,i)=>p.classList.toggle("active",i===currentPage));
  dots.forEach((d,i)=>d.classList.toggle("active",i===currentPage));
  $("#pageNumber").textContent = `0${currentPage+1} / 0${pages.length}`;
  $("#prevBtn").disabled = currentPage===0;
  $("#nextBtn").disabled = currentPage===pages.length-1;
}
$("#prevBtn").addEventListener("click",()=>showPage(currentPage-1));
$("#nextBtn").addEventListener("click",()=>showPage(currentPage+1));
dots.forEach((d,i)=>d.addEventListener("click",()=>showPage(i)));
$("#homeLink").addEventListener("click",e=>{e.preventDefault();scrapbook.classList.add("hidden");welcome.classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"});});
document.addEventListener("keydown",e=>{if(scrapbook.classList.contains("hidden"))return;if(e.key==="ArrowRight")showPage(currentPage+1);if(e.key==="ArrowLeft")showPage(currentPage-1);if(e.key==="Escape")closeLightbox();});

$("#filmNext").addEventListener("click",()=>$("#filmTrack").scrollBy({left:210,behavior:"smooth"}));
$("#filmBack").addEventListener("click",()=>$("#filmTrack").scrollBy({left:-210,behavior:"smooth"}));

// Open any scrapbook photograph in a lightbox.
const lightbox=$("#lightbox"), lightboxImage=$("#lightboxImage");
$$(".polaroid img, .film-track img, .tiny-photo img").forEach(img=>img.addEventListener("click",()=>{
  lightboxImage.src=img.src; lightbox.classList.remove("hidden");
}));
function closeLightbox(){lightbox.classList.add("hidden");}
$("#lightboxClose").addEventListener("click",closeLightbox);
lightbox.addEventListener("click",e=>{if(e.target===lightbox)closeLightbox();});

// Birthday cake: blow out the candles with a little celebration.
const cakeModal=$("#cakeModal");
$("#cakeBtn").addEventListener("click",()=>cakeModal.classList.remove("hidden"));
$("#closeCake").addEventListener("click",()=>cakeModal.classList.add("hidden"));
cakeModal.addEventListener("click",e=>{if(e.target===cakeModal)cakeModal.classList.add("hidden");});
$("#blowBtn").addEventListener("click",()=>{
  $$(".candle").forEach(c=>c.classList.add("out"));
  $("#wishText").textContent="Wish made! May it find its way to you. ♥";
  $("#blowBtn").textContent="Wish sent ✨";
  confetti();
  showToast("A birthday wish sent with love ♥");
});

function showToast(message){
  const toast=$("#toast");toast.textContent=message;toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2600);
}
function confetti(){
  const symbols=["♥","✿","✦","♡","❀"];
  for(let i=0;i<34;i++){
    const el=document.createElement("span");el.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    Object.assign(el.style,{position:"fixed",left:Math.random()*100+"vw",top:"-30px",zIndex:60,
      color:["#e6a0a0","#e8c994","#fff0dc"][i%3],fontSize:(12+Math.random()*18)+"px",
      pointerEvents:"none",transition:"transform 2.8s linear, opacity 2.8s linear"});
    document.body.appendChild(el);
    requestAnimationFrame(()=>{el.style.transform=`translate(${(Math.random()-.5)*160}px, ${window.innerHeight+80}px) rotate(${Math.random()*500}deg)`;el.style.opacity="0.1";});
    setTimeout(()=>el.remove(),3000);
  }
}

// Optional gentle generated melody. It starts only after the visitor taps the music control.
let audioContext=null, musicTimer=null, musicOn=false, noteIndex=0;
const melody=[261.63,329.63,392,329.63,293.66,349.23,440,392];
function playNote(){
  if(!audioContext||!musicOn)return;
  const osc=audioContext.createOscillator(),gain=audioContext.createGain();
  osc.type="sine";osc.frequency.value=melody[noteIndex++%melody.length];
  gain.gain.setValueAtTime(0.0001,audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.035,audioContext.currentTime+.08);
  gain.gain.exponentialRampToValueAtTime(0.0001,audioContext.currentTime+.65);
  osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+.7);
}
$("#musicBtn").addEventListener("click",async()=>{
  if(!audioContext)audioContext=new (window.AudioContext||window.webkitAudioContext)();
  if(audioContext.state==="suspended")await audioContext.resume();
  musicOn=!musicOn;
  if(musicOn){playNote();musicTimer=setInterval(playNote,720);$("#musicBtn").innerHTML='♫ <span>Music on</span>';}
  else{clearInterval(musicTimer);$("#musicBtn").innerHTML='♫ <span>Music off</span>';}
});
