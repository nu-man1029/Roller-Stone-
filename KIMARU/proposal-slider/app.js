var GITHUB_BASE='https://nu-man1029.github.io/Roller-Stone-/KIMARU/proposal-slider';
var LABELS=['A','B','C','D','E'];
var TYPE_OPTIONS=['乱形石調','タイル調','木目調','その他'];
var COLOR_OPTIONS=['RSグレー','RSグレージュ','RSブラック','その他'];

// ══ IMAGE COMPRESSION ══
function compressImage(dataUrl,cb,maxW,q){
  maxW=maxW||1600;q=q||0.75;
  var img=new Image();img.onload=function(){
    var w=img.width,h=img.height;
    if(w>maxW){h=Math.round(h*maxW/w);w=maxW}
    var c=document.createElement('canvas');c.width=w;c.height=h;
    c.getContext('2d').drawImage(img,0,0,w,h);
    cb(c.toDataURL('image/jpeg',q));
  };img.src=dataUrl;
}

// ══ LIGHTBOX ══
function openLightbox(src){
  var lb=document.getElementById('lightbox');
  document.getElementById('lightboxImg').src=src;
  lb.style.display='flex';
  document.body.style.overflow='hidden';
}
function closeLightbox(){
  document.getElementById('lightbox').style.display='none';
  document.body.style.overflow='';
}
document.getElementById('lightbox').addEventListener('click',function(e){
  if(e.target===this||e.target===document.getElementById('lightboxImg'))closeLightbox();
});
// Make slider images tappable (not during drag)
var dragMoved=false;
document.addEventListener('click',function(e){
  if(dragMoved)return;
  var img=e.target;
  if(img.tagName==='IMG' && (img.closest('.slider-layer')||img.classList.contains('pattern-card-thumb')||img.closest('.ap-material-thumb')||img.closest('.pattern-card-material'))){
    openLightbox(img.src);
  }
});

// ══ STATE ══
var angles=[{name:'正面',step1:null,step2:null,s1n:'',s2n:''}];
var patterns=[]; // {data,materialData,materialName,ptype,color,customType,customColor}
var activeAngle=0,activePattern=0,progress=0,isDragging=false;
var hasStep2=true;
var $=function(id){return document.getElementById(id)};
var container=$('sliderContainer'),layer2=$('layer2'),layer3=$('layer3');
var dividerLine=$('dividerLine'),imgStep1=$('imgStep1'),imgStep2=$('imgStep2'),imgStep3=$('imgStep3');
var labelBefore=$('labelBefore'),labelConcrete=$('labelConcrete'),labelRS=$('labelRS');

// ══ SLIDER ══
function updateSlider(p){
  progress=Math.max(0,Math.min(100,p));
  if(hasStep2){
    if(progress<=50){var d=(progress/50)*100;layer2.style.clipPath='inset(0 '+(100-d)+'% 0 0)';layer3.style.clipPath='inset(0 0 0 100%)';dividerLine.style.left=d+'%';dividerLine.style.opacity=(d>2&&d<98)?'1':'0';labelBefore.style.opacity=d>65?'0':'1';labelConcrete.style.opacity=d>25?'1':'0';labelRS.style.opacity='0'}
    else{var d=((progress-50)/50)*100;layer2.style.clipPath='inset(0 0 0 0)';layer3.style.clipPath='inset(0 '+(100-d)+'% 0 0)';dividerLine.style.left=d+'%';dividerLine.style.opacity=(d>2&&d<98)?'1':'0';labelBefore.style.opacity='0';labelConcrete.style.opacity=d>65?'0':'1';labelRS.style.opacity=d>25?'1':'0'}
  }else{
    var d=progress;layer2.style.clipPath='inset(0 0 0 100%)';layer3.style.clipPath='inset(0 '+(100-d)+'% 0 0)';dividerLine.style.left=d+'%';dividerLine.style.opacity=(d>2&&d<98)?'1':'0';labelBefore.style.opacity=d>65?'0':'1';if(labelConcrete)labelConcrete.style.opacity='0';labelRS.style.opacity=d>25?'1':'0';
  }
  document.querySelectorAll('.btn-step').forEach(function(b){b.classList.toggle('active',Math.abs(progress-parseInt(b.dataset.pos))<8)});
}
function getP(e){var r=container.getBoundingClientRect();return((e.touches?e.touches[0].clientX:e.clientX)-r.left)/r.width*100}
container.addEventListener('mousedown',function(e){isDragging=true;dragMoved=false;updateSlider(getP(e))});
container.addEventListener('touchstart',function(e){isDragging=true;dragMoved=false;updateSlider(getP(e))},{passive:true});
window.addEventListener('mousemove',function(e){if(isDragging){dragMoved=true;updateSlider(getP(e))}});
window.addEventListener('touchmove',function(e){if(isDragging){dragMoved=true;updateSlider(getP(e))}},{passive:true});
window.addEventListener('mouseup',function(){isDragging=false});
window.addEventListener('touchend',function(){isDragging=false});

function animateTo(t){var s=progress,dur=800,t0=performance.now();(function step(now){var p=Math.min((now-t0)/dur,1);var e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;updateSlider(s+(t-s)*e);if(p<1)requestAnimationFrame(step)})(performance.now())}

// ══ STEP BUTTONS ══
function renderSteps(){
  var btns=$('stepButtons'),tl=$('timeline');
  if(hasStep2){
    btns.innerHTML='<button class="btn-step active" data-pos="0">STEP 1</button><button class="btn-step" data-pos="50">STEP 2</button><button class="btn-step" data-pos="100">STEP 3</button>';
    tl.innerHTML='<div class="timeline-step step-1"><div class="timeline-dot">1</div><div class="timeline-text">現状</div></div><div class="timeline-step step-2"><div class="timeline-dot">2</div><div class="timeline-text">下地施工</div></div><div class="timeline-step step-3"><div class="timeline-dot">3</div><div class="timeline-text">ローラーストーン<br>施工完了</div></div>';
    labelConcrete.style.display='';labelRS.textContent='STEP 3｜ローラーストーン';
  }else{
    btns.innerHTML='<button class="btn-step active" data-pos="0">STEP 1　現状</button><button class="btn-step" data-pos="100">STEP 2　RS施工完了</button>';
    tl.innerHTML='<div class="timeline-step step-1"><div class="timeline-dot">1</div><div class="timeline-text">現状</div></div><div class="timeline-step step-3"><div class="timeline-dot">2</div><div class="timeline-text">ローラーストーン<br>施工完了</div></div>';
    labelConcrete.style.display='none';labelRS.textContent='STEP 2｜RS施工完了';
  }
  btns.querySelectorAll('.btn-step').forEach(function(b){['click','touchend'].forEach(function(ev){b.addEventListener(ev,function(e){e.preventDefault();animateTo(parseInt(this.dataset.pos))})})});
  updateSlider(progress);
}

// ══ PROJECT INFO ══
var fieldClient=$('fieldClient'),fieldSite=$('fieldSite'),fieldDate=$('fieldDate'),fieldNote=$('fieldNote');
var today=new Date();fieldDate.value=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
function updateProjectInfo(){
  var c=fieldClient.value.trim(),s=fieldSite.value.trim(),d=fieldDate.value,n=fieldNote.value.trim();
  if(c){$('heroBadge').style.display='';$('heroClient').innerHTML='<span>'+c+'</span> 様　施工提案パース画像'}else $('heroBadge').style.display='none';
  $('heroSite').textContent=s?'📍 '+s:'';$('heroDate').textContent=d?'📅 '+d.replace(/-/g,'/'):'';$('heroNote').textContent=n?'※ '+n:'';
  var ds=d?d.replace(/-/g,''):'undated';var cs=c?'_'+c.replace(/[\s　様]/g,'').substring(0,10):'';var ss=s?'_'+s.replace(/[\s　]/g,'_').substring(0,20):'';
  $('exportFilename').textContent='📁 '+ds+cs+ss+'_proposal.html';
  estimateSize();
}
[fieldClient,fieldSite,fieldDate,fieldNote].forEach(function(f){f.addEventListener('input',updateProjectInfo)});
updateProjectInfo();

// ══ STEP2 TOGGLE ══
$('toggleStep2').addEventListener('click',function(){hasStep2=!hasStep2;$('step2Switch').classList.toggle('on',hasStep2);renderSteps();renderAngles();progress=0;updateSlider(0)});
$('step2Switch').classList.add('on');

// ══ APPLY VIEW ══
function applyView(){
  var a=angles[activeAngle];
  imgStep1.src=a.step1||'./images/step1_before.png';
  imgStep2.src=a.step2||'./images/step2_concrete.png';
  if(patterns.length>0&&patterns[activePattern])imgStep3.src=patterns[activePattern].data;
  else imgStep3.src='./images/step3_default.png';
}

// ══ ANGLES ══
var pendingAngleUpload=null;var angleFileInput=$('angleFileInput');
function renderAngles(){
  var tabs=$('angleTabs');
  if(angles.length>1){tabs.classList.add('show');tabs.innerHTML='';angles.forEach(function(a,i){var t=document.createElement('button');t.className='angle-tab'+(i===activeAngle?' active':'');t.textContent=a.name||('アングル'+(i+1));t.addEventListener('click',function(){activeAngle=i;renderAngles();applyView();updateSlider(progress)});tabs.appendChild(t)})}else tabs.classList.remove('show');
  var list=$('angleList');list.innerHTML='';var plus='<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  angles.forEach(function(a,i){
    var div=document.createElement('div');div.className='admin-angle';
    var s2html=hasStep2?'<div class="upload-box '+(a.step2?'has-image':'')+' step2-upload" data-angle="'+i+'" data-step="2"><div class="ub-thumb">'+(a.step2?'<img src="'+a.step2+'">':plus)+'</div><div><div class="ub-label">STEP 2（下地）</div>'+(a.s2n?'<div class="ub-file">'+a.s2n+'</div>':'')+'</div></div>':'<div class="upload-box step2-upload hidden"></div>';
    div.innerHTML='<div class="admin-angle-header"><input type="text" value="'+(a.name||'')+'" placeholder="アングル名" data-idx="'+i+'" class="angle-name-input">'+(angles.length>1?'<button class="btn-remove" data-idx="'+i+'">×</button>':'')+'</div><div class="admin-angle-uploads"><div class="upload-box '+(a.step1?'has-image':'')+'" data-angle="'+i+'" data-step="1"><div class="ub-thumb">'+(a.step1?'<img src="'+a.step1+'">':plus)+'</div><div><div class="ub-label">STEP 1（現状）</div>'+(a.s1n?'<div class="ub-file">'+a.s1n+'</div>':'')+'</div></div>'+s2html+'</div>';
    list.appendChild(div);
  });
  list.querySelectorAll('.angle-name-input').forEach(function(inp){inp.addEventListener('input',function(){angles[parseInt(this.dataset.idx)].name=this.value;renderAngles()})});
  list.querySelectorAll('.btn-remove').forEach(function(b){b.addEventListener('click',function(){angles.splice(parseInt(this.dataset.idx),1);if(activeAngle>=angles.length)activeAngle=Math.max(0,angles.length-1);renderAngles();applyView()})});
  list.querySelectorAll('.upload-box:not(.hidden)').forEach(function(box){box.addEventListener('click',function(){pendingAngleUpload={ai:parseInt(this.dataset.angle),step:parseInt(this.dataset.step)};angleFileInput.click()})});
  $('angleCount').textContent=angles.length;$('addAngle').classList.toggle('disabled',angles.length>=5);
}
angleFileInput.addEventListener('change',function(e){
  var f=e.target.files[0];if(!f||!pendingAngleUpload)return;
  var r=new FileReader();r.onload=function(ev){compressImage(ev.target.result,function(c){
    var a=angles[pendingAngleUpload.ai];if(pendingAngleUpload.step===1){a.step1=c;a.s1n=f.name}else{a.step2=c;a.s2n=f.name}
    renderAngles();applyView();pendingAngleUpload=null;
  })};r.readAsDataURL(f);angleFileInput.value='';
});
$('addAngle').addEventListener('click',function(){if(angles.length<5){angles.push({name:'',step1:null,step2:null,s1n:'',s2n:''});renderAngles()}});

// ══ PATTERNS ══
var patternFileInput=$('patternFileInput');
var materialFileInput=$('materialFileInput');
var pendingMaterialIdx=null;

function getPatternLabel(p){
  var type=p.ptype==='その他'?p.customType:p.ptype;
  var color=p.color==='その他'?p.customColor:p.color;
  return (type||'')+(type&&color?' / ':'')+(color||'');
}

function buildSelect(options,selected,dataIdx,dataField,cls){
  var html='<select class="'+cls+'" data-idx="'+dataIdx+'" data-field="'+dataField+'" style="padding:8px 10px;border:1px solid rgba(0,0,0,.08);border-radius:6px;font-family:\'Noto Sans JP\',sans-serif;font-size:12px;color:#1a1a1a;background:#fafafa;outline:none;width:100%;-webkit-appearance:none;appearance:none">';
  html+='<option value="">選択...</option>';
  options.forEach(function(o){html+='<option value="'+o+'"'+(o===selected?' selected':'')+'>'+o+'</option>'});
  return html+'</select>';
}

function renderPatterns(){
  var list=$('patternList');list.innerHTML='';
  patterns.forEach(function(p,i){
    var div=document.createElement('div');div.className='admin-pattern';
    var typeSelect=buildSelect(TYPE_OPTIONS,p.ptype,i,'ptype','pat-select');
    var colorSelect=buildSelect(COLOR_OPTIONS,p.color,i,'color','pat-select');
    var customTypeHtml=p.ptype==='その他'?'<input type="text" value="'+(p.customType||'')+'" placeholder="施工パターン名" data-idx="'+i+'" data-field="customType" class="pat-input" style="padding:6px 8px;border:1px solid rgba(0,0,0,.08);border-radius:6px;font-size:11px;width:100%;margin-top:4px;font-family:\'Noto Sans JP\',sans-serif;outline:none">':'';
    var customColorHtml=p.color==='その他'?'<input type="text" value="'+(p.customColor||'')+'" placeholder="カラー名" data-idx="'+i+'" data-field="customColor" class="pat-input" style="padding:6px 8px;border:1px solid rgba(0,0,0,.08);border-radius:6px;font-size:11px;width:100%;margin-top:4px;font-family:\'Noto Sans JP\',sans-serif;outline:none">':'';
    var matThumb=p.materialData?'<img src="'+p.materialData+'">':'<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';

    div.innerHTML='<div class="admin-pattern-top"><div class="ap-num">'+LABELS[i]+'</div><div class="ap-thumb"><img src="'+p.data+'"></div><div class="ap-fields"><div>'+typeSelect+customTypeHtml+'</div><div>'+colorSelect+customColorHtml+'</div></div><button class="btn-remove" data-idx="'+i+'">×</button></div>'+
      '<div class="ap-material" data-midx="'+i+'"><div class="ap-material-thumb" data-midx="'+i+'">'+matThumb+'</div><div><div class="ap-material-label">素材参考画像</div>'+(p.materialName?'<div class="ap-material-file">'+p.materialName+'</div>':'<div class="ap-material-file">タップで追加</div>')+'</div></div>';
    list.appendChild(div);
  });

  // Select change handlers
  list.querySelectorAll('.pat-select').forEach(function(sel){sel.addEventListener('change',function(){
    var i=parseInt(this.dataset.idx),f=this.dataset.field;
    patterns[i][f]=this.value;
    renderPatterns();renderPatternCards();estimateSize();
  })});
  // Custom text input handlers
  list.querySelectorAll('.pat-input').forEach(function(inp){inp.addEventListener('input',function(){
    var i=parseInt(this.dataset.idx);patterns[i][this.dataset.field]=this.value;
    renderPatternCards();
  })});
  // Remove
  list.querySelectorAll('.btn-remove').forEach(function(b){b.addEventListener('click',function(){patterns.splice(parseInt(this.dataset.idx),1);if(activePattern>=patterns.length)activePattern=Math.max(0,patterns.length-1);renderPatterns();renderPatternCards();applyView();estimateSize()})});
  // Material upload
  list.querySelectorAll('.ap-material-thumb').forEach(function(el){el.addEventListener('click',function(e){
    e.stopPropagation();
    if(el.querySelector('img')&&e.target.tagName==='IMG'){openLightbox(e.target.src);return}
    pendingMaterialIdx=parseInt(this.dataset.midx);materialFileInput.click();
  })});
  list.querySelectorAll('.ap-material').forEach(function(el){el.addEventListener('click',function(e){
    if(e.target.closest('.ap-material-thumb'))return;
    pendingMaterialIdx=parseInt(this.dataset.midx);materialFileInput.click();
  })});

  $('patternBadge').textContent=patterns.length+'/5';
  $('addPattern').classList.toggle('disabled',patterns.length>=5);
  $('btnExport').disabled=patterns.length===0;
  renderPatternCards();estimateSize();
}

materialFileInput.addEventListener('change',function(e){
  var f=e.target.files[0];if(!f||pendingMaterialIdx===null)return;
  var r=new FileReader();r.onload=function(ev){compressImage(ev.target.result,function(c){
    patterns[pendingMaterialIdx].materialData=c;patterns[pendingMaterialIdx].materialName=f.name;
    renderPatterns();pendingMaterialIdx=null;
  },800,0.7)};r.readAsDataURL(f);materialFileInput.value='';
});

function renderPatternCards(){
  var sec=$('patternSection'),cards=$('patternCards');
  if(patterns.length>=1){sec.classList.add('show');cards.innerHTML='';
    patterns.forEach(function(p,i){
      var label=getPatternLabel(p)||'パターン '+LABELS[i];
      var c=document.createElement('div');c.className='pattern-card'+(i===activePattern?' active':'');
      var matHtml=p.materialData?'<div class="pattern-card-material"><img src="'+p.materialData+'"><span>素材参考</span></div>':'';
      c.innerHTML='<img class="pattern-card-thumb" src="'+p.data+'"><div class="pattern-card-info"><div class="pattern-card-name">'+label+'</div></div>'+matHtml+'<div class="pattern-card-badge"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" fill="none" stroke="#fff" stroke-width="3"/></svg></div>';
      c.addEventListener('click',function(e){if(e.target.tagName==='IMG')return;activePattern=i;applyView();renderPatternCards();animateTo(hasStep2?100:100)});
      cards.appendChild(c);
    });
  }else sec.classList.remove('show');
}

$('addPattern').addEventListener('click',function(){if(patterns.length<5)patternFileInput.click()});
patternFileInput.addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){compressImage(ev.target.result,function(c){patterns.push({data:c,fn:f.name,ptype:'',color:'',customType:'',customColor:'',materialData:null,materialName:''});activePattern=patterns.length-1;renderPatterns();applyView();animateTo(100)})};r.readAsDataURL(f);patternFileInput.value=''});

// ══ SIZE ESTIMATE ══
function estimateSize(){
  var t=0;angles.forEach(function(a){if(a.step1)t+=a.step1.length*0.75;if(a.step2)t+=a.step2.length*0.75});
  patterns.forEach(function(p){t+=p.data.length*0.75;if(p.materialData)t+=p.materialData.length*0.75});
  var mb=(t/1024/1024).toFixed(1);
  var fn=$('exportFilename').textContent.split('（')[0];
  $('exportFilename').textContent=fn+'（推定 '+mb+'MB）';
}

// ══ EXPORT ══
$('btnExport').addEventListener('click',function(){
  var info={client:fieldClient.value.trim(),site:fieldSite.value.trim(),date:fieldDate.value,note:fieldNote.value.trim()};
  var html=buildExport(info);
  var blob=new Blob([html],{type:'text/html'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;
  var ds=info.date?info.date.replace(/-/g,''):'undated';var cs=info.client?'_'+info.client.replace(/[\s　様]/g,'').substring(0,10):'';var ss=info.site?'_'+info.site.replace(/[\s　]/g,'_').substring(0,20):'';
  a.download=ds+cs+ss+'_proposal.html';a.click();URL.revokeObjectURL(url);
});

function buildExport(info){
  var B=GITHUB_BASE+'/images';
  var pd=patterns.map(function(p,i){var lbl=getPatternLabel(p)||'パターン '+LABELS[i];return{label:lbl,data:p.data,mat:p.materialData}});
  var ad=angles.map(function(a){return{name:a.name,s1:a.step1,s2:a.step2}});
  var css=document.querySelector('style').textContent;
  // Get extra styles
  var extraStyles='';document.querySelectorAll('style').forEach(function(s,i){if(i>0)extraStyles+=s.textContent});
  css+=extraStyles;
  // Remove admin styles
  css=css.replace(/\.admin[^{]*\{[^}]*\}/g,'').replace(/\.upload[^{]*\{[^}]*\}/g,'').replace(/\.btn-remove[^{]*\{[^}]*\}/g,'').replace(/\.btn-export[^{]*\{[^}]*\}/g,'').replace(/\.ap-[^{]*\{[^}]*\}/g,'').replace(/\.field-[^{]*\{[^}]*\}/g,'').replace(/\.toggle[^{]*\{[^}]*\}/g,'');

  var angleTabs='';
  if(ad.length>1)angleTabs='<div class="angle-tabs show" id="angleTabs">'+ad.map(function(a,i){return'<button class="angle-tab'+(i===0?' active':'')+'" onclick="switchAngle('+i+')">'+(a.name||'アングル'+(i+1))+'</button>'}).join('')+'</div>';

  var patCards='';
  if(pd.length>=1)patCards='<div class="pattern-section show"><div class="pattern-section-title">デザインパターンを選択</div><div class="pattern-cards">'+pd.map(function(p,i){
    var matHtml=p.mat?'<div class="pattern-card-material"><img src="'+p.mat+'" onclick="event.stopPropagation();openLightbox(this.src)"><span>素材参考</span></div>':'';
    return'<div class="pattern-card'+(i===0?' active':'')+'" onclick="switchPattern('+i+')"><img class="pattern-card-thumb" src="'+p.data+'" onclick="event.stopPropagation();openLightbox(this.src)"><div class="pattern-card-info"><div class="pattern-card-name">'+p.label+'</div></div>'+matHtml+'<div class="pattern-card-badge"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" fill="none" stroke="#fff" stroke-width="3"/></svg></div></div>'}).join('')+'</div></div>';

  var hero='';
  if(info.client)hero='<div class="hero-proposal" style="display:block"><div class="hero-inner"><div class="hero-tag">施工前イメージ提案</div><div class="hero-client"><span>'+info.client+'</span> 様　施工提案パース画像</div><div class="hero-sub">※ こちらはAIパースによる施工前のイメージ画像です</div>'+(info.note?'<div class="hero-note">※ '+info.note+'</div>':'')+'<div class="hero-meta">'+(info.site?'<span>📍 '+info.site+'</span>':'')+(info.date?'<span>📅 '+info.date.replace(/-/g,'/')+'</span>':'')+'</div></div></div>';

  var s1=ad[0].s1||B+'/step1_before.png',s2=ad[0].s2||B+'/step2_concrete.png';
  var stepBtns,tlHtml;
  if(hasStep2){
    stepBtns='<button class="btn-step active" data-pos="0">STEP 1</button><button class="btn-step" data-pos="50">STEP 2</button><button class="btn-step" data-pos="100">STEP 3</button>';
    tlHtml='<div class="timeline-step step-1"><div class="timeline-dot">1</div><div class="timeline-text">現状</div></div><div class="timeline-step step-2"><div class="timeline-dot">2</div><div class="timeline-text">下地施工</div></div><div class="timeline-step step-3"><div class="timeline-dot">3</div><div class="timeline-text">ローラーストーン<br>施工完了</div></div>';
  }else{
    stepBtns='<button class="btn-step active" data-pos="0">STEP 1　現状</button><button class="btn-step" data-pos="100">STEP 2　RS施工完了</button>';
    tlHtml='<div class="timeline-step step-1"><div class="timeline-dot">1</div><div class="timeline-text">現状</div></div><div class="timeline-step step-3"><div class="timeline-dot">2</div><div class="timeline-text">ローラーストーン<br>施工完了</div></div>';
  }
  var labelS2=hasStep2?'<div class="stage-label label-2" id="labelConcrete">STEP 2｜下地施工</div>':'';
  var labelRStxt=hasStep2?'STEP 3｜ローラーストーン':'STEP 2｜RS施工完了';

  return '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>'+(info.client?info.client+' 様 ':'')+'施工提案 | Cement Artist Nu☆Man</title><style>'+css+'</style></head><body>'+
    '<div class="watermark"><img src="'+B+'/symbol.jpg" alt=""></div>'+
    '<div class="header"><div class="brand"><div class="brand-logo"><img src="'+B+'/logo.jpg" alt=""></div><div class="brand-text"><strong>Cement Artist Nu☆Man</strong><span class="company-name">株式会社KENSIN</span></div></div></div>'+
    hero+
    '<div class="title-section"><p class="subtitle">スライダーを左右にドラッグして変化をご確認ください</p></div>'+
    angleTabs+
    '<div class="slider-wrapper"><div class="slider-container" id="sliderContainer">'+
    '<div class="slider-layer layer-1"><img id="imgStep1" src="'+s1+'" onclick="openLightbox(this.src)"></div>'+
    '<div class="slider-layer layer-2" id="layer2"><img id="imgStep2" src="'+s2+'"></div>'+
    '<div class="slider-layer layer-3" id="layer3"><img id="imgStep3" src="'+pd[0].data+'"></div>'+
    '<div class="divider" id="dividerLine"><div class="divider-knob"><svg viewBox="0 0 24 24"><path d="M8 5l-5 7 5 7M16 5l5 7-5 7"/></svg></div></div>'+
    '<div class="stage-label label-1" id="labelBefore">STEP 1｜現状</div>'+labelS2+'<div class="stage-label label-3" id="labelRS">'+labelRStxt+'</div></div>'+
    '<div class="timeline" id="timeline">'+tlHtml+'</div>'+
    '<div class="step-buttons" id="stepButtons">'+stepBtns+'</div>'+
    patCards+
    '<div class="instagram-cta"><a href="https://www.instagram.com/cementart_numan/" target="_blank" rel="noopener"><div class="insta-avatar"><img src="'+B+'/insta_profile.jpg" alt=""></div><div class="insta-info"><div class="insta-handle">@cementart_numan <svg viewBox="0 0 24 24" fill="none" stroke="#c32aa3" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="#c32aa3" stroke="none"/></svg></div><div class="insta-bio">セメントアーティストぬーまん｜ローラーストーン@三重県</div></div><div class="insta-follow-btn">Instagramを見る</div></a></div></div>'+
    '<div class="footer">Cement Artist Nu☆Man ─ 株式会社KENSIN ─ ローラーストーン認定施工店</div>'+
    '<div id="lightbox" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.92);z-index:9999;justify-content:center;align-items:center;cursor:zoom-out" onclick="closeLightbox()"><img id="lightboxImg" style="max-width:95%;max-height:95%;object-fit:contain;border-radius:8px;touch-action:pinch-zoom"><div style="position:absolute;top:16px;right:16px;width:36px;height:36px;background:rgba(255,255,255,.15);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff">×</div></div>'+
    '<script>'+
    'function openLightbox(s){var l=document.getElementById("lightbox");document.getElementById("lightboxImg").src=s;l.style.display="flex";document.body.style.overflow="hidden"}'+
    'function closeLightbox(){document.getElementById("lightbox").style.display="none";document.body.style.overflow=""}'+
    'var HS2='+hasStep2+';var ANGLES='+JSON.stringify(ad.map(function(a){return{name:a.name,s1:a.s1||B+'/step1_before.png',s2:a.s2||B+'/step2_concrete.png'}}))+';var PATTERNS='+JSON.stringify(pd.map(function(p){return p.data}))+';'+
    'var activeA=0,activeP=0,progress=0,isDragging=false,dragMoved=false;'+
    'var container=document.getElementById("sliderContainer"),layer2=document.getElementById("layer2"),layer3=document.getElementById("layer3"),dividerLine=document.getElementById("dividerLine"),labelBefore=document.getElementById("labelBefore"),labelConcrete=document.getElementById("labelConcrete"),labelRS=document.getElementById("labelRS"),imgStep1=document.getElementById("imgStep1"),imgStep2=document.getElementById("imgStep2"),imgStep3=document.getElementById("imgStep3");'+
    'function updateSlider(p){progress=Math.max(0,Math.min(100,p));if(HS2){if(progress<=50){var d=(progress/50)*100;layer2.style.clipPath="inset(0 "+(100-d)+"% 0 0)";layer3.style.clipPath="inset(0 0 0 100%)";dividerLine.style.left=d+"%";dividerLine.style.opacity=(d>2&&d<98)?"1":"0";labelBefore.style.opacity=d>65?"0":"1";if(labelConcrete)labelConcrete.style.opacity=d>25?"1":"0";labelRS.style.opacity="0"}else{var d=((progress-50)/50)*100;layer2.style.clipPath="inset(0 0 0 0)";layer3.style.clipPath="inset(0 "+(100-d)+"% 0 0)";dividerLine.style.left=d+"%";dividerLine.style.opacity=(d>2&&d<98)?"1":"0";labelBefore.style.opacity="0";if(labelConcrete)labelConcrete.style.opacity=d>65?"0":"1";labelRS.style.opacity=d>25?"1":"0"}}else{var d=progress;layer2.style.clipPath="inset(0 0 0 100%)";layer3.style.clipPath="inset(0 "+(100-d)+"% 0 0)";dividerLine.style.left=d+"%";dividerLine.style.opacity=(d>2&&d<98)?"1":"0";labelBefore.style.opacity=d>65?"0":"1";labelRS.style.opacity=d>25?"1":"0"}document.querySelectorAll(".btn-step").forEach(function(b){b.classList.toggle("active",Math.abs(progress-parseInt(b.dataset.pos))<8)})}'+
    'function getP(e){var r=container.getBoundingClientRect();return((e.touches?e.touches[0].clientX:e.clientX)-r.left)/r.width*100}'+
    'container.addEventListener("mousedown",function(e){isDragging=true;dragMoved=false;updateSlider(getP(e))});container.addEventListener("touchstart",function(e){isDragging=true;dragMoved=false;updateSlider(getP(e))},{passive:true});window.addEventListener("mousemove",function(e){if(isDragging){dragMoved=true;updateSlider(getP(e))}});window.addEventListener("touchmove",function(e){if(isDragging){dragMoved=true;updateSlider(getP(e))}},{passive:true});window.addEventListener("mouseup",function(){isDragging=false});window.addEventListener("touchend",function(){isDragging=false});'+
    'function animateTo(t){var s=progress,dur=800,t0=performance.now();(function step(now){var p=Math.min((now-t0)/dur,1);var e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;updateSlider(s+(t-s)*e);if(p<1)requestAnimationFrame(step)})(performance.now())}'+
    'document.querySelectorAll(".btn-step").forEach(function(b){["click","touchend"].forEach(function(ev){b.addEventListener(ev,function(e){e.preventDefault();animateTo(parseInt(this.dataset.pos))})})});'+
    'function switchAngle(i){activeA=i;imgStep1.src=ANGLES[i].s1;imgStep2.src=ANGLES[i].s2;document.querySelectorAll(".angle-tab").forEach(function(t,j){t.classList.toggle("active",j===i)});updateSlider(progress)}'+
    'function switchPattern(i){activeP=i;imgStep3.src=PATTERNS[i];document.querySelectorAll(".pattern-card").forEach(function(c,j){c.classList.toggle("active",j===i)});animateTo(100)}'+
    'updateSlider(0);'+
    '<\/script></body></html>';
}

// ══ INIT ══
renderSteps();renderAngles();renderPatterns();applyView();updateSlider(0);
