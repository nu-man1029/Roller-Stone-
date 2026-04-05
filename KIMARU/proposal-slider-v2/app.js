var GITHUB_BASE='https://nu-man1029.github.io/Roller-Stone-/KIMARU/proposal-slider-v2';
var LABELS=['A','B','C','D','E','F','G','H','I','J'];
var TYPE_OPTIONS=['乱形石調','タイル調','木目調','その他'];
var COLOR_OPTIONS=['RSグレー','RSグレージュ','RSブラック','RSミルクティー','RSピンクブラウン','RSイエローベーシュ','RSオレンジ','RSモスグリーン','その他'];

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
  if(img.tagName==='IMG' && (img.closest('.slider-layer')||img.closest('.ap-material-thumb')||img.closest('.pattern-card-material'))){
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

  $('patternBadge').textContent=patterns.length+'/10';
  $('addPattern').classList.toggle('disabled',patterns.length>=10);
  $('btnExport').disabled=patterns.length===0;
  renderPatternCards();estimateSize();updateReelButtons();updateUploadBtn();
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
      var plb='<div style="position:absolute;top:5px;left:5px;background:rgba(26,26,26,.82);color:#fff;font-size:10px;font-weight:900;padding:2px 8px;border-radius:4px">パターン'+LABELS[i]+'</div>';
      c.innerHTML='<div style="position:relative">'+plb+'<img class="pattern-card-thumb" src="'+p.data+'"></div><div class="pattern-card-info"><div class="pattern-card-name">'+label+'</div></div>'+matHtml+'<div class="pattern-card-badge"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" fill="none" stroke="#fff" stroke-width="3"/></svg></div>';
      c.addEventListener('click',function(e){
        if(e.target.closest('.pattern-card-material'))return;
        activePattern=i;applyView();renderPatternCards();animateTo(hasStep2?100:100);
      });
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
    var plb='<div style="position:absolute;top:5px;left:5px;background:rgba(26,26,26,.82);color:#fff;font-size:10px;font-weight:900;padding:2px 8px;border-radius:4px">パターン'+['A','B','C','D','E'][i]+'</div>';
    return'<div class="pattern-card'+(i===0?' active':'')+'" onclick="if(!event.target.closest(\'.pattern-card-material\')){switchPattern('+i+')}"><div style="position:relative">'+plb+'<img class="pattern-card-thumb" src="'+p.data+'"></div><div class="pattern-card-info"><div class="pattern-card-name">'+p.label+'</div></div>'+matHtml+'<div class="pattern-card-badge"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" fill="none" stroke="#fff" stroke-width="3"/></svg></div></div>'}).join('')+'</div></div>';

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

// ══════════════════════════════════════════
// ❺-B GITHUB DIRECT UPLOAD
// ══════════════════════════════════════════
var GITHUB_OWNER='nu-man1029';
var GITHUB_REPO='Roller-Stone-';
var GITHUB_CLIENTS_BASE='KIMARU/proposal-slider-v2/clients';

// トークン保存・読み込み
(function initToken(){
  var saved=localStorage.getItem('gh_token');
  if(saved)$('githubToken').value=saved;
})();
function saveToken(){
  var t=$('githubToken').value.trim();
  if(t){localStorage.setItem('gh_token',t);$('btnSaveToken').textContent='✅ 保存済';setTimeout(function(){$('btnSaveToken').textContent='保存'},1500)}
}

// フォルダ名自動生成（案件情報から）
function autoFolder(){
  var c=fieldClient.value.trim().replace(/[\s　様]/g,'').substring(0,10);
  var s=fieldSite.value.trim().replace(/[\s　]/g,'-').substring(0,15);
  var base=(c||'client')+(s?'-'+s:'');
  // 英数字・ハイフン以外を除去
  return base.toLowerCase().replace(/[^a-z0-9\-]/g,'') || 'client-proposal';
}
[fieldClient,fieldSite].forEach(function(f){f.addEventListener('input',function(){
  if(!$('githubFolder').dataset.manual)$('githubFolder').value=autoFolder();
})});
$('githubFolder').addEventListener('input',function(){this.dataset.manual='1'});

// アップロードボタン有効化
function updateUploadBtn(){
  $('btnUploadGitHub').disabled=patterns.length===0||!$('githubToken').value.trim()||!$('githubFolder').value.trim();
}
$('githubToken').addEventListener('input',updateUploadBtn);
$('githubFolder').addEventListener('input',updateUploadBtn);

// base64エンコード（Unicode対応）
function toBase64Unicode(str){
  return btoa(unescape(encodeURIComponent(str)));
}

// GitHub APIでファイルをアップロード
async function pushToGitHub(token,path,content,message){
  var apiUrl='https://api.github.com/repos/'+GITHUB_OWNER+'/'+GITHUB_REPO+'/contents/'+path;
  // 既存ファイルのSHAを取得（上書き用）
  var sha=null;
  try{
    var checkRes=await fetch(apiUrl,{headers:{'Authorization':'token '+token,'Accept':'application/vnd.github.v3+json'}});
    if(checkRes.ok){var existing=await checkRes.json();sha=existing.sha}
  }catch(e){}

  var body={message:message,content:toBase64Unicode(content)};
  if(sha)body.sha=sha;

  var res=await fetch(apiUrl,{
    method:'PUT',
    headers:{'Authorization':'token '+token,'Content-Type':'application/json','Accept':'application/vnd.github.v3+json'},
    body:JSON.stringify(body)
  });
  if(!res.ok){var err=await res.json();throw new Error(err.message||'Upload failed ('+res.status+')')}
  return await res.json();
}

$('btnUploadGitHub').addEventListener('click',async function(){
  var token=$('githubToken').value.trim();
  var folder=$('githubFolder').value.trim().toLowerCase().replace(/[^a-z0-9\-]/g,'');
  if(!token||!folder||patterns.length===0)return;

  // UI状態リセット
  $('githubResult').style.display='none';
  $('githubError').style.display='none';
  $('githubUploading').style.display='block';
  $('btnUploadGitHub').disabled=true;

  try{
    var info={client:fieldClient.value.trim(),site:fieldSite.value.trim(),date:fieldDate.value,note:fieldNote.value.trim()};
    var html=buildExport(info);
    var sub=$('githubSubFolder').value.trim().toLowerCase().replace(/[^a-z0-9\-]/g,'');var path=GITHUB_CLIENTS_BASE+'/'+(sub?sub+'/':'')+folder+'/index.html';
    var msg='Add proposal: '+(sub?sub+'/':'')+folder+(info.client?' ('+info.client+')':'');
    await pushToGitHub(token,path,html,msg);

    var pageUrl='https://nu-man1029.github.io/Roller-Stone-/KIMARU/proposal-slider-v2/clients/'+(sub?sub+'/':'')+folder+'/';
    $('githubUrlText').textContent=pageUrl;
    $('githubUploading').style.display='none';
    $('githubResult').style.display='block';

    // トークンを自動保存
    localStorage.setItem('gh_token',token);
  }catch(e){
    $('githubUploading').style.display='none';
    $('githubError').style.display='block';
    $('githubError').innerHTML='❌ アップロード失敗：'+e.message+'<br><span style="color:#999">・トークンの権限（Contents: Read and Write）を確認してください<br>・フォルダ名に使えない文字が含まれていないか確認してください</span>';
  }
  $('btnUploadGitHub').disabled=false;
});

var _ghUrl='';
function copyGithubUrl(){
  var url=$('githubUrlText').textContent;
  navigator.clipboard.writeText(url).then(function(){
    var btn=event.target;btn.textContent='✅ コピーしました！';setTimeout(function(){btn.textContent='📋 URLをコピー'},2000);
  });
}

// ══════════════════════════════════════════
// ❻ REEL COVER IMAGE GENERATION
// ══════════════════════════════════════════
var HOOKS = {
  A: ['施工前にコレ見せたら','どうなると思います？'],
  B: ['※これ、まだ','施工してません'],
  C: ['カタログ渡して終わりの提案、','まだやってます？'],
  D: ['想像させない、','体験させる提案'],
  E: ['提案の成約率を上げた','たった1つの方法']
};

var hookSelect=$('hookSelect'), customHookArea=$('customHookArea');
hookSelect.addEventListener('change',function(){customHookArea.style.display=this.value==='custom'?'':'none'});

function getHookLines(){
  var v=hookSelect.value;
  if(v==='custom') return [$('hookLine1').value||'1行目',$('hookLine2').value||'2行目'];
  return HOOKS[v]||HOOKS.A;
}

function updateReelButtons(){
  var hasP=patterns.length>0;
  $('btnCover').disabled=!hasP;
  $('btnReelVideo').disabled=!hasP;
}

// Canvas cover generation
$('btnCover').addEventListener('click',function(){
  var style=$('styleSelect').value;
  var hook=getHookLines();
  var beforeSrc=angles[0].step1||'./images/step1_before.png';
  var afterSrc=patterns[0].data;
  var patLabel=getPatternLabel(patterns[0])||'パターン A';
  var logoSrc=document.querySelector('.brand-logo img').src;

  // Load images then draw
  var imgs={};var loaded=0;var total=3;
  function onLoad(){loaded++;if(loaded>=total){
    document.fonts.ready.then(function(){drawCover(imgs,style,hook,patLabel)});
  }}
  imgs.before=new Image();imgs.before.onload=onLoad;imgs.before.src=beforeSrc;
  imgs.after=new Image();imgs.after.onload=onLoad;imgs.after.src=afterSrc;
  imgs.logo=new Image();imgs.logo.onload=onLoad;imgs.logo.src=logoSrc;
});

function drawCover(imgs,style,hook,patLabel){
  var W=1080,H=1920;
  var cv=document.createElement('canvas');cv.width=W;cv.height=H;
  var ctx=cv.getContext('2d');

  // Style configs
  var styles={
    dark:{bg:'#0d0d0d',text:'#ffffff',accent:'#f18200',sub:'#666666',lblBg:'rgba(13,13,13,0.8)',tagStyle:'outline',serif:true,brandText:'#ffffff',ctaBg:'#0d0d0d',ctaText:'#f18200',divColor:'#ffffff'},
    light:{bg:'#f5f3ef',text:'#1a1a1a',accent:'#f18200',sub:'#999999',lblBg:'rgba(255,255,255,0.85)',tagStyle:'filled',serif:true,brandText:'#1a1a1a',ctaBg:'#f18200',ctaText:'#ffffff',divColor:'#f18200'},
    navy:{bg:'#121c30',text:'#ffffff',accent:'#f18200',sub:'#8c96aa',lblBg:'rgba(18,28,48,0.85)',tagStyle:'filled-inv',serif:false,brandText:'#ffffff',ctaBg:'#121c30',ctaText:'#ffffff',divColor:'#ffffff'}
  };
  var s=styles[style]||styles.dark;

  // Background
  ctx.fillStyle=s.bg;ctx.fillRect(0,0,W,H);
  // Top accent
  ctx.fillStyle=s.accent;ctx.fillRect(0,0,W,style==='navy'?8:2);

  // Font setup
  var serif=s.serif?'"Noto Serif JP","serif"':'"Noto Sans JP","sans-serif"';
  var sans='"Noto Sans JP","sans-serif"';

  // Tag
  ctx.font='700 20px '+sans;
  var tagT='施工前イメージ提案';
  if(s.tagStyle==='outline'){
    ctx.strokeStyle=s.accent;ctx.lineWidth=2;
    roundRect(ctx,60,56,ctx.measureText(tagT).width+28,34,17);ctx.stroke();
    ctx.fillStyle=s.accent;ctx.fillText(tagT,74,78);
  } else if(s.tagStyle==='filled'){
    ctx.fillStyle=s.accent;roundRect(ctx,60,56,ctx.measureText(tagT).width+28,34,17);ctx.fill();
    ctx.fillStyle='#ffffff';ctx.fillText(tagT,74,78);
  } else {
    ctx.fillStyle='#ffffff';ctx.fillRect(50,48,ctx.measureText(tagT).width+30,40);
    ctx.fillStyle=s.bg;ctx.fillText(tagT,62,76);
  }

  // Hook text
  ctx.font='900 '+(s.serif?'80':'82')+'px '+serif;
  ctx.fillStyle=s.text;ctx.fillText(hook[0],58,200);
  ctx.fillStyle=s.accent;ctx.fillText(hook[1],58,300);

  // Note line
  ctx.strokeStyle=style==='light'?'#ddd':'#333';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(60,340);ctx.lineTo(360,340);ctx.stroke();
  ctx.font='400 24px '+serif;ctx.fillStyle=s.sub;
  ctx.fillText('※ これは、まだ施工していません',60,370);

  // Before/After split
  var iy=410,ih=500,hw=W/2;
  cropFillCanvas(ctx,imgs.before,0,iy,hw-2,ih);
  cropFillCanvas(ctx,imgs.after,hw+2,iy,hw-2,ih);
  ctx.fillStyle=s.divColor;ctx.fillRect(hw-1,iy,3,ih);

  // Labels
  var ly=iy+ih-50;
  ctx.fillStyle=s.lblBg;ctx.fillRect(0,ly,hw-2,50);
  ctx.font='700 22px '+sans;ctx.fillStyle=style==='light'?'#666':'#999';
  ctx.fillText('B E F O R E',20,ly+34);
  ctx.fillStyle=style==='navy'?s.accent:s.lblBg;
  if(style==='navy'){ctx.fillStyle=s.accent;ctx.fillRect(hw+2,ly,hw,50)}
  else{ctx.fillStyle=s.lblBg;ctx.fillRect(hw+2,ly,hw,50)}
  ctx.fillStyle=style==='navy'?'#fff':s.accent;
  ctx.fillText('A F T E R  I M A G E',hw+20,ly+34);

  // Separator
  var sy=iy+ih+20;
  ctx.strokeStyle=style==='light'?'#ddd':'#222';ctx.lineWidth=1;
  if(style==='navy'){ctx.fillStyle=s.accent;ctx.fillRect(40,sy,W-80,3)}
  else{ctx.beginPath();ctx.moveTo(60,sy);ctx.lineTo(W-60,sy);ctx.stroke();
  ctx.fillStyle=s.accent;ctx.beginPath();ctx.arc(W/2,sy,4,0,Math.PI*2);ctx.fill()}

  // Full after image
  var fy=sy+30,fh=560;
  cropFillCanvas(ctx,imgs.after,0,fy,W,fh);
  // Gradient fade
  for(var y=0;y<200;y++){
    var yy=fy+fh-200+y;var a=y/200;
    ctx.fillStyle=s.bg;ctx.globalAlpha=a;ctx.fillRect(0,yy,W,1);
  }
  ctx.globalAlpha=1;

  // Pattern label
  var py=fy+fh-60;
  if(style==='navy'){
    ctx.fillStyle='#fff';ctx.fillRect(40,py,ctx.measureText(patLabel).width+40,50);
    ctx.font='700 22px '+sans;ctx.fillStyle=s.bg;ctx.fillText(patLabel,56,py+34);
  } else {
    ctx.font='700 22px '+serif;ctx.fillStyle=s.accent;ctx.fillText('—',50,py+22);
    ctx.fillStyle=style==='light'?'#1a1a1a':'#fff';ctx.fillText(patLabel,80,py+22);
  }

  // Branding
  var by=fy+fh+24;
  ctx.strokeStyle=style==='light'?'#ddd':'#222';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(60,by);ctx.lineTo(W-60,by);ctx.stroke();
  var by2=by+20;
  // Logo circle
  ctx.save();ctx.beginPath();ctx.arc(60+28,by2+28,28,0,Math.PI*2);ctx.clip();
  ctx.drawImage(imgs.logo,60,by2,56,56);ctx.restore();
  ctx.font='700 26px '+serif;ctx.fillStyle=s.brandText;ctx.fillText('Cement Artist Nu☆Man',130,by2+26);
  ctx.font='400 16px '+sans;ctx.fillStyle=s.sub;ctx.fillText('株式会社KENSIN',130,by2+50);
  ctx.font='400 22px '+sans;ctx.fillStyle=s.accent;ctx.fillText('@cementart_numan',60,by2+92);
  ctx.font='400 18px '+serif;ctx.fillStyle=style==='light'?'#999':'#777';
  ctx.fillText('お客様のスマホで',60,by2+126);
  ctx.fillText('施工後イメージを体験できる提案ツール',60,by2+152);

  // CTA
  var cy=H-100;
  if(style==='light'){ctx.fillStyle=s.accent;ctx.fillRect(0,cy,W,100)}
  else{ctx.fillStyle=s.accent;ctx.fillRect(0,cy,W,style==='navy'?6:2);ctx.fillStyle=s.ctaBg;ctx.fillRect(0,cy+(style==='navy'?6:2),W,100)}
  ctx.font='700 26px '+(s.serif?serif:sans);ctx.fillStyle=s.ctaText;
  ctx.fillText('詳しくはプロフィールから  →',W/2-220,cy+56);

  // Download
  cv.toBlob(function(blob){
    var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;
    a.download='reel_cover_'+style+'.png';a.click();URL.revokeObjectURL(url);
  },'image/png');
}

function cropFillCanvas(ctx,img,x,y,tw,th){
  var iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height;
  var s=Math.max(tw/iw,th/ih);
  var sw=tw/s,sh=th/s;
  var sx=(iw-sw)/2,sy=(ih-sh)/2;
  ctx.drawImage(img,sx,sy,sw,sh,x,y,tw,th);
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}

// ══════════════════════════════════════════
// ❼ REEL SLIDER VIDEO HTML
// ══════════════════════════════════════════
$('btnReelVideo').addEventListener('click',function(){
  var style=$('styleSelect').value;
  var hook=getHookLines();
  var beforeSrc=angles[0].step1||imgStep1.src;
  var logoSrc=document.querySelector('.brand-logo img').src;
  var pd=patterns.map(function(p,i){
    return{src:p.data,label:getPatternLabel(p)||'パターン '+LABELS[i]};
  });

  var styles={
    dark:{bg:'#0d0d0d',text:'#fff',accent:'#f18200',sub:'#666',tagBorder:'border:2px solid #f18200',tagColor:'#f18200',tagBg:'transparent',hookFont:'"Noto Serif JP",serif',noteColor:'#666',lblBefore:'#999',lblAfterBg:'rgba(13,13,13,.65)',divBg:'#fff',dotInactive:'rgba(255,255,255,.2)',brandText:'#fff',ctaBorder:'#f18200',ctaText:'#f18200',ctaBg:'#0d0d0d'},
    light:{bg:'#f5f3ef',text:'#1a1a1a',accent:'#f18200',sub:'#999',tagBorder:'',tagColor:'#fff',tagBg:'#f18200',hookFont:'"Noto Serif JP",serif',noteColor:'#999',lblBefore:'#666',lblAfterBg:'rgba(255,255,255,.7)',divBg:'#f18200',dotInactive:'rgba(0,0,0,.12)',brandText:'#1a1a1a',ctaBorder:'#f18200',ctaText:'#fff',ctaBg:'#f18200'},
    navy:{bg:'#121c30',text:'#fff',accent:'#f18200',sub:'#8c96aa',tagBorder:'',tagColor:'#121c30',tagBg:'#fff',hookFont:'"Noto Sans JP",sans-serif',noteColor:'#8c96aa',lblBefore:'#fff',lblAfterBg:'#f18200',divBg:'#fff',dotInactive:'rgba(255,255,255,.2)',brandText:'#fff',ctaBorder:'#f18200',ctaText:'#fff',ctaBg:'#121c30'}
  };
  var s=styles[style]||styles.dark;

  // Build dots HTML
  var dotsHtml='';for(var i=0;i<=pd.length;i++) dotsHtml+='<div class="dot'+(i===0?' active':'')+'" id="dot'+i+'"></div>';

  var patDataJson=JSON.stringify(pd.map(function(p){return{src:p.src,label:p.label}}));

  var html='<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">';
  html+='<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500;700;900&family=Noto+Sans+JP:wght@400;700;900&display=swap" rel="stylesheet">';
  html+='<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;overflow:hidden;background:'+s.bg+'}';
  html+='.reel{width:100vw;height:100vh;position:relative;overflow:hidden;background:'+s.bg+';display:flex;flex-direction:column}';
  html+='.top{padding:40px 40px 20px;flex-shrink:0;z-index:10}';
  html+='.tag{display:inline-block;padding:6px 18px;border-radius:20px;font:700 16px "Noto Sans JP";'+s.tagBorder+';color:'+s.tagColor+';background:'+s.tagBg+';margin-bottom:16px}';
  html+='.hook{font:900 52px/1.2 '+s.hookFont+';color:'+s.text+'}.hook em{font-style:normal;color:'+s.accent+'}';
  html+='.note{font:400 18px '+s.hookFont+';color:'+s.noteColor+';margin-top:14px}.note::before{content:"";display:inline-block;width:40px;height:1px;background:'+s.sub+';vertical-align:middle;margin-right:10px}';
  html+='.slider-area{flex:1;position:relative;overflow:hidden;min-height:0}';
  html+='.slider-img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}';
  html+='#imgBefore{z-index:1}#imgAfter{z-index:2;clip-path:inset(0 100% 0 0)}';
  html+='#divider{position:absolute;top:0;width:3px;height:100%;background:'+s.divBg+';z-index:10;left:0;opacity:0;box-shadow:0 0 12px rgba(0,0,0,.4)}';
  html+='#dividerKnob{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:48px;height:48px;border-radius:50%;background:'+s.accent+';border:3px solid #fff;box-shadow:0 2px 12px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center}';
  html+='#dividerKnob svg{width:22px;height:22px;fill:#fff}';
  html+='.pat-label{position:absolute;bottom:16px;left:16px;z-index:15;opacity:0;transition:opacity .3s}';
  html+='.pat-label-inner{display:inline-flex;align-items:center;gap:10px;padding:10px 18px;background:'+s.lblAfterBg+';backdrop-filter:blur(8px);border-radius:8px;border-left:3px solid '+s.accent+'}';
  html+='.pat-label-inner .pat-letter{font:900 22px "Noto Sans JP";color:'+s.accent+'}';
  html+='.pat-label-inner .pat-text{font:700 16px "Noto Sans JP";color:#fff}';
  html+='.before-label{position:absolute;bottom:16px;right:16px;z-index:15;padding:8px 16px;background:rgba(255,255,255,.15);backdrop-filter:blur(8px);border-radius:8px;font:700 14px "Noto Sans JP";color:rgba(255,255,255,.7);letter-spacing:.1em;opacity:1;transition:opacity .3s}';
  html+='.bottom{flex-shrink:0;padding:16px 40px 30px;display:flex;align-items:center;gap:14px;z-index:10;border-top:2px solid '+s.accent+'}';
  html+='.bottom-logo{width:44px;height:44px;border-radius:50%;overflow:hidden;flex-shrink:0}.bottom-logo img{width:100%;height:100%;object-fit:cover}';
  html+='.bottom-name{font:900 18px '+s.hookFont+';color:'+s.brandText+'}.bottom-ig{font:400 14px "Noto Sans JP";color:'+s.accent+';margin-top:2px}';
  html+='.progress{position:absolute;bottom:100px;right:30px;z-index:20;display:flex;flex-direction:column;gap:10px}';
  html+='.dot{width:10px;height:10px;border-radius:50%;background:'+s.dotInactive+';transition:all .4s}.dot.active{background:'+s.accent+';box-shadow:0 0 8px rgba(241,130,0,.5)}';
  html+='#countdown{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font:900 120px "Noto Sans JP";color:'+s.accent+';opacity:0;z-index:30;text-shadow:0 4px 20px rgba(0,0,0,.5)}';
  html+='</style></head><body><div class="reel"><div class="top">';
  html+='<div class="tag">施工前イメージ提案</div>';
  html+='<div class="hook">'+hook[0]+'<br><em>'+hook[1]+'</em></div>';
  html+='<div class="note">これは、まだ施工していません</div></div>';
  html+='<div class="slider-area">';
  html+='<img id="imgBefore" class="slider-img" src="'+beforeSrc+'">';
  html+='<img id="imgAfter" class="slider-img" src="'+pd[0].src+'">';
  html+='<div id="divider"><div id="dividerKnob"><svg viewBox="0 0 24 24"><path d="M8 5l-5 7 5 7M16 5l5 7-5 7"/></svg></div></div>';
  html+='<div class="pat-label" id="patLabel"><div class="pat-label-inner"><span class="pat-letter" id="patLetter">A</span><span class="pat-text" id="patText">'+pd[0].label+'</span></div></div>';
  html+='<div class="before-label" id="beforeLabel">B E F O R E</div>';
  html+='<div class="progress">'+dotsHtml+'</div></div>';
  html+='<div class="bottom"><div class="bottom-logo"><img src="'+logoSrc+'"></div><div><div class="bottom-name">Cement Artist Nu☆Man</div><div class="bottom-ig">@cementart_numan</div></div></div>';
  html+='<div id="countdown"></div></div>';

  // Script
  html+='<script>';
  html+='var PATTERNS='+patDataJson+';var LABELS=["A","B","C","D","E"];';
  html+='var imgAfter=document.getElementById("imgAfter"),divider=document.getElementById("divider"),patLabel=document.getElementById("patLabel"),patLetter=document.getElementById("patLetter"),patText=document.getElementById("patText"),beforeLabel=document.getElementById("beforeLabel"),countdown=document.getElementById("countdown");';
  html+='var dots=[];for(var i=0;i<=PATTERNS.length;i++)dots.push(document.getElementById("dot"+i));';
  html+='function setDot(i){dots.forEach(function(d,j){if(d)d.classList.toggle("active",j===i)})}';
  html+='function slideTo(pct,dur){return new Promise(function(res){var cur=parseFloat((imgAfter.style.clipPath.match(/inset\\(0 ([0-9.]+)%/)||[0,100])[1]);var startPct=100-cur;var t0=performance.now();divider.style.opacity="1";(function step(now){var t=Math.min((now-t0)/dur,1);var e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;var c=startPct+(pct-startPct)*e;imgAfter.style.clipPath="inset(0 "+(100-c)+"% 0 0)";divider.style.left=c+"%";if(t<1)requestAnimationFrame(step);else{if(pct<=0||pct>=100)divider.style.opacity="0";res()}})(performance.now())})}';
  html+='function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}';
  html+='async function play(){imgAfter.style.clipPath="inset(0 100% 0 0)";divider.style.opacity="0";beforeLabel.style.opacity="1";patLabel.style.opacity="0";setDot(0);await wait(2200);';
  html+='for(var i=0;i<PATTERNS.length;i++){imgAfter.src=PATTERNS[i].src;patLetter.textContent=LABELS[i];patText.textContent=PATTERNS[i].label;imgAfter.style.clipPath="inset(0 100% 0 0)";await wait(300);beforeLabel.style.opacity="0";patLabel.style.opacity="0";setDot(i+1);await slideTo(100,1400);patLabel.style.opacity="1";await wait(1800);patLabel.style.opacity="0";';
  html+='if(i<PATTERNS.length-1){await slideTo(0,1000);beforeLabel.style.opacity="1";setDot(0);await wait(800)}}';
  html+='patLabel.style.opacity="1";await wait(2000);await slideTo(0,1000);play()}';
  html+='async function start(){for(var n=3;n>=1;n--){countdown.textContent=n;countdown.style.opacity="1";await wait(700);countdown.style.opacity="0";await wait(300)}play()}start();';
  html+='<\/script></body></html>';

  var blob=new Blob([html],{type:'text/html'});var url=URL.createObjectURL(blob);
  var a=document.createElement('a');a.href=url;a.download='reel_slider_'+style+'.html';a.click();URL.revokeObjectURL(url);
});

// ══ INIT ══
renderSteps();renderAngles();renderPatterns();applyView();updateSlider(0);
