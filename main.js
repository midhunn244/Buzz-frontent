var nav=document.getElementById('nav'),b=document.getElementById('burger'),l=document.getElementById('links');
function s(){nav.classList.toggle('solid',window.scrollY>40)}s();window.addEventListener('scroll',s,{passive:true});
b.addEventListener('click',function(){var o=l.classList.toggle('open');b.setAttribute('aria-expanded',o)});
l.addEventListener('click',function(){l.classList.remove('open');b.setAttribute('aria-expanded',false)});
var io=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12});
document.querySelectorAll('.rev').forEach(function(el,i){el.style.transitionDelay=(i%3)*80+'ms';io.observe(el)});

/* reviews from backend (falls back to the static markup if the API is offline) */
fetch('/api/reviews').then(function(r){return r.ok?r.json():Promise.reject()}).then(function(d){
  var box=document.querySelector('.rv');if(!box||!d.reviews||!d.reviews.length)return;
  box.textContent='';
  d.reviews.forEach(function(v){
    var q=document.createElement('blockquote'),s=document.createElement('div'),p=document.createElement('p'),c=document.createElement('cite');
    q.className='rev in';s.className='stars';s.setAttribute('aria-hidden','true');s.textContent='★★★★★';
    p.textContent='\u201c'+v.text+'\u201d';c.textContent=v.author;
    q.append(s,p,c);box.appendChild(q);
  });
}).catch(function(){});
/* enquiry form -> POST /api/enquiry */
var f=document.getElementById('enq');
if(f)f.addEventListener('submit',function(e){
  e.preventDefault();var m=document.getElementById('enq-msg'),d=Object.fromEntries(new FormData(f));
  if(!d.name.trim()||!d.contact.trim()||!d.message.trim()){m.textContent='Please fill in all fields.';return}
  m.textContent='Sending...';
  fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)})
   .then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error||'Error');return j})})
   .then(function(){m.textContent='Thank you! We will get back to you soon.';f.reset()})
   .catch(function(err){m.textContent=err.message+' You can also call 077987 83017.'});
});
