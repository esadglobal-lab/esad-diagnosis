import React, { useState, useMemo, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   ESAD GLOBAL · CREATIVE MIND MAP — 인터랙티브 성향 밸런스 진단
   8단계: 좋아하는것 → 상황반응 → 밸런스 → 조형트랙 → 세부과정
          → 주제컨셉 → 만족유형 → 창작프로필/결과
   navy #303763 / gold #C9A34E / teal #5FB3B3 / coral #D98884
   ═══════════════════════════════════════════════════════════════ */

const NAVY="#303763", GOLD="#C9A34E", TEAL="#5FB3B3", CORAL="#D98884";
const INK="#2b2f45", SOFT="#f4f6fb", LINE="#dfe3ee", MUTED="#8891a8";

const AXES = [
  { key:"art",    label:"예술·조형", color:CORAL,   group:"예체능" },
  { key:"body",   label:"신체·활동", color:"#E0A86B",group:"예체능" },
  { key:"lang",   label:"언어·표현", color:"#8E7CC3",group:"인문" },
  { key:"social", label:"사회·관계", color:GOLD,    group:"인문" },
  { key:"logic",  label:"논리·수리", color:NAVY,    group:"이공계" },
  { key:"explore",label:"탐구·실험", color:TEAL,    group:"이공계" },
];
const AX = Object.fromEntries(AXES.map(a=>[a.key,a]));
const GROUPS = [
  { key:"이공계", color:NAVY,  axes:["logic","explore"] },
  { key:"인문",   color:GOLD,  axes:["lang","social"] },
  { key:"예체능", color:CORAL, axes:["art","body"] },
];

/* STEP 01 좋아하는 것 — 성향별 */
const POOL_BY_AXIS = {
  art:["그림·드로잉","색칠·페인팅","만들기·조소","웹툰·만화·애니","디자인·브랜딩","패션·스타일링","사진·영상","건축·공간","캘리그래피","일러스트·캐릭터","도자·공예","그래피티","굿즈 만들기","인테리어·꾸미기","3D·모델링"],
  body:["운동·스포츠","춤·무용","악기·음악","요리·베이킹","여행·탐방","등산·아웃도어","자전거","수영·물놀이","연기·연극","보드·스케이트","식물 가꾸기","캠핑·낚시"],
  lang:["글쓰기·스토리","책·독서","외국어","토론·발표","영화·드라마","시·에세이","일기·기록","브이로그","랩·작사","연설·MC","시나리오","서평"],
  social:["친구들과 어울리기","봉사·나눔","리더·기획","SNS·콘텐츠","모임 운영","이벤트 기획","상담·들어주기","팀 프로젝트","캠페인·환경","협업·중재","트렌드 관찰"],
  logic:["수학·퍼즐","코딩","게임·전략","경제·투자","보드게임·체스","통계·데이터","규칙 만들기","암호·추리","계획 짜기","건축 설계","금융·회계"],
  explore:["과학·실험","자연·동물 관찰","기계·로봇","우주·미래상상","천문·별","화학 실험","분해·조립","생명·의학","코딩으로 만들기","환경·생태","발명 노트"],
};

/* STEP 02 상황 문항 20 */
const Q = [
 ["새로운 것을 만들 때 나는 먼저…",[["스케치부터 그린다","art"],["자료를 조사한다","explore"],["사람들과 아이디어를 나눈다","social"],["일단 만들어 본다","body"]]],
 ["자유 시간이 생기면 주로…",[["그림·영상을 감상/그린다","art"],["책을 읽거나 글을 쓴다","lang"],["몸을 움직인다","body"],["궁금한 걸 찾아 실험한다","explore"]]],
 ["친구들 사이에서 나는…",[["분위기를 띄운다","social"],["아이디어를 낸다","art"],["계획을 정리·기획한다","logic"],["조용히 관찰한다","explore"]]],
 ["문제가 생겼을 때 나는…",[["원인을 논리적으로 따진다","logic"],["여러 의견을 듣는다","social"],["직접 시도해 본다","explore"],["새 방식으로 바꿔 본다","art"]]],
 ["설명이 가장 잘 이해될 때는…",[["그림·도표로 볼 때","art"],["글·말로 정리해줄 때","lang"],["직접 해볼 때","body"],["숫자·규칙으로 정리될 때","logic"]]],
 ["전시·박물관에 가면 나는…",[["색·형태에 끌린다","art"],["설명·배경을 읽는다","lang"],["작동 원리가 궁금하다","explore"],["함께 감상을 나눈다","social"]]],
 ["모둠 과제에서 내 역할은…",[["전체 방향 기획","logic"],["역할 조율","social"],["결과물 디자인·표현","art"],["자료 조사·검증","explore"]]],
 ["가장 뿌듯한 순간은…",[["멋진 작품을 완성했을 때","art"],["어려운 문제를 풀었을 때","logic"],["누군가를 도왔을 때","social"],["새로운 걸 알아냈을 때","explore"]]],
 ["영상을 볼 때 더 끌리는 건…",[["감각적인 영상·연출","art"],["탄탄한 스토리","lang"],["몸으로 하는 활동","body"],["과학·원리 콘텐츠","explore"]]],
 ["나를 표현하는 편한 방법은…",[["그림·이미지로","art"],["글·말로","lang"],["행동·몸짓으로","body"],["만든 결과물로","logic"]]],
 ["여행지를 고를 때 나는…",[["사진 찍기 좋은 곳","art"],["역사·이야기가 있는 곳","lang"],["활동·체험이 많은 곳","body"],["특이한 자연이 있는 곳","explore"]]],
 ["수업 중 가장 집중될 때는…",[["만들기·실습할 때","body"],["토론·발표할 때","lang"],["원리를 파고들 때","logic"],["친구와 협력할 때","social"]]],
 ["물건을 살 때 먼저 보는 건…",[["디자인·색감","art"],["가격·성능 비교","logic"],["리뷰·후기","social"],["작동 방식·기능","explore"]]],
 ["힘든 일이 있을 때 나는…",[["그림·음악으로 푼다","art"],["글로 적어 정리한다","lang"],["운동으로 푼다","body"],["친구와 이야기한다","social"]]],
 ["직업 이야기를 들으면…",[["어떻게 만드는지 궁금","art"],["어떤 사람을 돕는지 궁금","social"],["어떤 원리인지 궁금","explore"],["어떻게 성과내는지 궁금","logic"]]],
 ["새 게임·앱을 접하면 나는…",[["화면·디자인부터 본다","art"],["규칙·전략을 분석한다","logic"],["일단 눌러본다","body"],["숨은 기능을 탐색한다","explore"]]],
 ["칭찬받고 싶은 부분은…",[["창의적이다","art"],["논리적이다","logic"],["배려심 있다","social"],["호기심 많다","explore"]]],
 ["긴 글을 쓸 때 나는…",[["떠오르는 대로 자유롭게","art"],["구조를 먼저 잡고","logic"],["읽는 사람을 생각하며","social"],["풍부한 표현을 살려","lang"]]],
 ["모르는 것이 생기면 나는…",[["직접 실험해 확인","explore"],["자료·책을 찾는다","lang"],["아는 사람에게 묻는다","social"],["규칙·공식으로 따진다","logic"]]],
 ["미래의 나를 상상하면…",[["무언가 창작하는 사람","art"],["사람들을 이끄는 사람","social"],["새로운 걸 연구하는 사람","explore"],["세상을 분석·설계하는 사람","logic"]]],
];

/* STEP 04 조형 트랙 + STEP 05 세부 */
const TRACKS = [
  { ko:"그리기", en:"DRAWING", color:TEAL,  detail:["연필 소묘","크로키·인체","펜·라인","디지털 드로잉"] },
  { ko:"페인팅", en:"PAINTING", color:CORAL, detail:["수채화","아크릴·유화","과슈·포스터컬러","디지털 페인팅"] },
  { ko:"만들기", en:"MODELING", color:"#E0A86B", detail:["조각·조소","설치·공간","도자·공예","목공·금속"] },
  { ko:"디자인·공예", en:"DESIGN·CRAFT", color:NAVY, detail:["그래픽·편집","캐릭터·일러스트","패션·텍스타일","제품·가구","공간·건축","UX·UI·브랜딩"] },
  { ko:"애니·웹툰", en:"TIME-BASED", color:"#8E7CC3", detail:["애니메이션·모션","웹툰·만화·콘티"] },
];

/* STEP 06 주제·컨셉 */
const THEMES = [
  { name:"자연·생명", color:TEAL, desc:"풍경·계절·식물과 동물" },
  { name:"인간·감정", color:CORAL, desc:"표정·관계·마음의 결" },
  { name:"사회·메시지", color:GOLD, desc:"세상에 하고 싶은 말" },
  { name:"판타지·상상", color:"#8E7CC3", desc:"가상 세계·캐릭터·이야기" },
  { name:"일상·기록", color:"#7F9BD6", desc:"가까운 순간·사물·나의 하루" },
  { name:"기술·미래", color:"#5AA9A0", desc:"기계·도시·앞으로 올 세상" },
  { name:"아름다움·감각", color:"#E0A86B", desc:"색·형태·질감의 매력" },
  { name:"역사·문화", color:"#A78B5A", desc:"전통·신화·다른 나라 이야기" },
];

/* STEP 07 만족·도파민 */
const DOPA = [
  { key:"몰입", color:TEAL,  q:"시간 가는 줄 모르고 빠져들 때가 좋다" },
  { key:"완성", color:NAVY,  q:"끝까지 완성해 결과물을 손에 쥘 때 뿌듯하다" },
  { key:"숙련", color:GOLD,  q:"어제보다 실력이 는 게 느껴질 때 신난다" },
  { key:"표현", color:CORAL, q:"마음속 감정을 쏟아내면 후련하다" },
  { key:"탐구", color:"#8E7CC3", q:"새로운 방법·재료를 발견하면 설렌다" },
  { key:"인정", color:"#E0A86B", q:"누군가 내 작품을 알아봐 주면 힘이 난다" },
  { key:"연결", color:"#7F9BD6", q:"내 작품이 누군가에게 가닿을 때 의미를 느낀다" },
];

/* ESAD 프로그램 추천 규칙 (그룹/트랙/도파민 조합) */
function recommendPrograms({ topGroup, topTrack, topDopa, topThemes }) {
  const recs = [];
  if (topGroup === "예체능") {
    recs.push({ t:"ESAD 파운데이션 드로잉", d:"형태·명암 기초부터 감각 훈련까지, 모든 미술의 뿌리를 다지는 과정" });
    if (topTrack === "디자인·공예")
      recs.push({ t:"디자인·기획 스튜디오", d:"그래픽·브랜딩·UXUI로 아이디어를 시각화하는 실전 프로젝트" });
    if (topTrack === "애니·웹툰")
      recs.push({ t:"스토리·웹툰 크리에이터", d:"캐릭터·콘티·연출로 자기 세계관을 만드는 8주 창작 과정" });
    if (topTrack === "만들기")
      recs.push({ t:"입체·공간 조형 워크숍", d:"조소·설치로 손과 공간 감각을 키우는 핸즈온 클래스" });
  }
  if (topGroup === "인문" || topThemes.includes("사회·메시지") || topThemes.includes("인간·감정"))
    recs.push({ t:"컨셉·기획 라이팅", d:"작품에 담을 메시지와 서사를 글로 설계하는 아이데이션 훈련" });
  if (topGroup === "이공계" || topThemes.includes("기술·미래"))
    recs.push({ t:"건축·공간 디자인 트랙", d:"논리와 조형을 잇는 설계 사고, 국내외 건축 진학 대비" });
  if (topDopa === "인정" || topDopa === "연결")
    recs.push({ t:"포트폴리오·전시 프로젝트", d:"성산아트홀 전시로 이어지는 작품 완성·발표 과정" });
  if (topDopa === "탐구" || topDopa === "몰입")
    recs.push({ t:"실험·믹스드미디어 클래스", d:"새 재료·기법을 탐색하며 몰입의 즐거움을 키우는 과정" });
  // ESAD 시그니처: 유학
  recs.push({ t:"일본·미국 미대 유학 컨설팅", d:"기획→표현→사회 로드맵으로 진학 목표를 설계하는 1:1 상담" });
  // 중복 제거, 최대 4개
  const seen = new Set(); const out = [];
  for (const r of recs){ if(!seen.has(r.t)){ seen.add(r.t); out.push(r);} if(out.length>=4) break; }
  return out;
}

export default function App(){
  const [step, setStep] = useState(0);       // 0 intro, 1..8 steps, 9 result
  const [profile, setProfile] = useState({ name:"", school:"" });
  const [likes, setLikes] = useState({});     // {axisKey_idx: true}
  const [answers, setAnswers] = useState({});  // {qIdx: axisKey}
  const [tracks, setTracks] = useState({});    // {trackKo: true}
  const [details, setDetails] = useState({});  // {"trackKo::item": true}
  const [themes, setThemes] = useState({});    // {themeName: true}
  const [dopa, setDopa] = useState({});        // {dopaKey: 1..5}
  const resultRef = useRef(null);

  /* ── 점수 계산 ── */
  const scores = useMemo(()=>{
    const s = Object.fromEntries(AXES.map(a=>[a.key,0]));
    Object.keys(likes).forEach(k=>{ if(likes[k]){ const ax=k.split("__")[0]; s[ax]+=1; }});
    Object.values(answers).forEach(ax=>{ if(ax) s[ax]+=2; });
    return s;
  },[likes,answers]);
  const total = Object.values(scores).reduce((a,b)=>a+b,0)||1;
  const groupScores = GROUPS.map(g=>{
    const v=g.axes.reduce((a,k)=>a+scores[k],0);
    return {...g, value:v, pct:Math.round(v/total*100)};
  });
  const topGroup = [...groupScores].sort((a,b)=>b.value-a.value)[0]?.key;
  const maxAxis = Math.max(...AXES.map(a=>scores[a.key]),1);

  const topTrack = useMemo(()=>{
    const picked = Object.keys(tracks).filter(t=>tracks[t]);
    return picked[0] || null;
  },[tracks]);
  const topDopa = useMemo(()=>{
    let best=null,bv=-1;
    DOPA.forEach(d=>{ const v=dopa[d.key]||0; if(v>bv){bv=v;best=d.key;} });
    return bv>0?best:null;
  },[dopa]);
  const topThemes = Object.keys(themes).filter(t=>themes[t]);

  const recs = useMemo(()=>recommendPrograms({topGroup,topTrack,topDopa,topThemes}),
    [topGroup,topTrack,topDopa,topThemes]);

  /* ── 레이더 ── */
  const radar = useMemo(()=>{
    const cx=140,cy=140,R=100,n=AXES.length;
    const pts=AXES.map((a,i)=>{
      const ang=Math.PI*2*i/n-Math.PI/2;
      const r=(scores[a.key]/maxAxis)*R;
      return { x:cx+Math.cos(ang)*r, y:cy+Math.sin(ang)*r,
        ax:cx+Math.cos(ang)*R, ay:cy+Math.sin(ang)*R,
        lx:cx+Math.cos(ang)*(R+22), ly:cy+Math.sin(ang)*(R+22), a };
    });
    return {cx,cy,R,pts};
  },[scores,maxAxis]);
  const radarPath = radar.pts.map((p,i)=>`${i?"L":"M"}${p.x},${p.y}`).join(" ")+" Z";

  const [saving,setSaving]=useState(false);

  /* html2canvas를 CDN에서 1회 로드 */
  const loadH2C = ()=> new Promise((resolve,reject)=>{
    if(window.html2canvas) return resolve(window.html2canvas);
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload=()=>resolve(window.html2canvas);
    s.onerror=()=>reject(new Error("cdn"));
    document.head.appendChild(s);
  });

  /* ── 이미지 저장 : 결과 카드를 화면 그대로 캡처 ── */
  const saveImage = async ()=>{
    const el = resultRef.current; if(!el || saving) return;
    setSaving(true);
    try{
      // 폰트가 다 뜬 뒤 캡처 (글자 깨짐 방지)
      if(document.fonts && document.fonts.ready) { try{ await document.fonts.ready; }catch(e){} }
      const html2canvas = await loadH2C();
      const canvas = await html2canvas(el,{
        backgroundColor:"#ffffff", scale:2, useCORS:true, logging:false,
        windowWidth:el.scrollWidth, windowHeight:el.scrollHeight,
      });
      const finish = (blob)=>{
        if(!blob){ // 최후 폴백: dataURL 방식
          const url=canvas.toDataURL("image/png");
          const a=document.createElement("a"); a.href=url;
          a.download=`ESAD_진단결과_${profile.name||"학생"}.png`; a.click();
          return;
        }
        const url=URL.createObjectURL(blob);
        const a=document.createElement("a"); a.href=url;
        a.download=`ESAD_진단결과_${profile.name||"학생"}.png`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(()=>URL.revokeObjectURL(url),1500);
      };
      if(canvas.toBlob) canvas.toBlob(finish,"image/png"); else finish(null);
    }catch(err){
      alert("이미지 저장이 어려운 환경이에요. 화면을 캡처(스크린샷)해서 저장해 주세요.");
    }finally{
      setSaving(false);
    }
  };

  const T = ["시작","좋아하는 것","상황 반응","밸런스","조형 트랙","세부 과정","주제·컨셉","만족 유형","결과"];
  const totalSteps = 8;

  return (
    <div style={{minHeight:"100vh",background:SOFT,fontFamily:"'Pretendard','Noto Sans KR',system-ui,sans-serif",color:INK}}>
      <style>{`
        *{box-sizing:border-box;}
        .btn{cursor:pointer;border:none;border-radius:999px;font-weight:800;transition:all .15s;}
        .btn:active{transform:scale(.98);}
        .chip{cursor:pointer;transition:all .12s;user-select:none;}
        .chip:active{transform:scale(.97);}
        @media(max-width:640px){ .wrap{padding:14px!important;} .grid2{grid-template-columns:1fr!important;} }
      `}</style>

      <div className="wrap" style={{maxWidth:820,margin:"0 auto",padding:"22px 16px 60px"}}>
        {/* 헤더 */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:900,letterSpacing:1.2,color:NAVY}}>ESAD GLOBAL ART INSTITUTE</div>
          {step>0 && step<9 &&
            <div style={{fontSize:12,fontWeight:800,color:MUTED}}>STEP {step} / {totalSteps} · {T[step]}</div>}
        </div>
        {/* 진행바 */}
        {step>0 && step<9 &&
          <div style={{height:6,background:"#e6eaf3",borderRadius:99,marginBottom:20,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${step/totalSteps*100}%`,background:`linear-gradient(90deg,${NAVY},${TEAL})`,transition:"width .3s"}}/>
          </div>}

        {step===0 && <Intro profile={profile} setProfile={setProfile} onStart={()=>setStep(1)} />}

        {step===1 && <StepLikes likes={likes} setLikes={setLikes} />}
        {step===2 && <StepSituations answers={answers} setAnswers={setAnswers} />}
        {step===3 && <StepBalance {...{scores,groupScores,maxAxis,radar,radarPath,topGroup}} />}
        {step===4 && <StepTracks tracks={tracks} setTracks={setTracks} />}
        {step===5 && <StepDetails tracks={tracks} details={details} setDetails={setDetails} />}
        {step===6 && <StepThemes themes={themes} setThemes={setThemes} />}
        {step===7 && <StepDopa dopa={dopa} setDopa={setDopa} />}
        {step===8 &&
          <StepResult ref={resultRef} {...{profile,groupScores,radar,radarPath,scores,maxAxis,
            topGroup,topTrack,topThemes,topDopa,recs,saveImage,saving}} />}

        {/* 네비 */}
        {step>0 &&
          <div style={{display:"flex",gap:10,justifyContent:"space-between",marginTop:26}}>
            <button className="btn" onClick={()=>setStep(s=>Math.max(0,s-1))}
              style={{background:"#fff",color:NAVY,border:`2px solid ${LINE}`,padding:"12px 24px",fontSize:14}}>
              이전
            </button>
            {step<8
              ? <button className="btn" onClick={()=>setStep(s=>s+1)}
                  style={{background:NAVY,color:"#fff",padding:"12px 30px",fontSize:14}}>
                  {step===7?"결과 보기":"다음"}
                </button>
              : <button className="btn" onClick={()=>setStep(1)}
                  style={{background:GOLD,color:"#fff",padding:"12px 30px",fontSize:14}}>
                  다시 하기
                </button>}
          </div>}

        <div style={{textAlign:"center",marginTop:30,fontSize:10,fontWeight:800,letterSpacing:1,color:NAVY,opacity:.6}}>
          ESAD GLOBAL ART INSTITUTE · 기획 → 표현 → 사회
        </div>
      </div>
    </div>
  );
}

/* ══════════ 화면들 ══════════ */
const Card = React.forwardRef(function Card({children,style},ref){
  return <div ref={ref} style={{background:"#fff",borderRadius:20,padding:"26px 24px",boxShadow:"0 6px 24px rgba(48,55,99,.07)",...style}}>{children}</div>;
});
function Head({n,title,desc}){
  return <div style={{marginBottom:18}}>
    <div style={{display:"flex",alignItems:"baseline",gap:8}}>
      {n && <span style={{fontSize:13,fontWeight:900,color:GOLD}}>{n}</span>}
      <h2 style={{margin:0,fontSize:21,fontWeight:900,color:NAVY}}>{title}</h2>
    </div>
    {desc && <p style={{margin:"7px 0 0",fontSize:13.5,color:"#6b7285",fontWeight:600,lineHeight:1.55}}>{desc}</p>}
  </div>;
}

function Intro({profile,setProfile,onStart}){
  return <Card style={{position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:-30,right:-20,width:110,height:110,borderRadius:"50%",background:CORAL,opacity:.85}}/>
    <div style={{position:"absolute",top:40,right:70,width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#9fd7d7,#bfe6c9)"}}/>
    <div style={{position:"relative"}}>
      <div style={{fontSize:12,fontWeight:800,letterSpacing:1.4,color:NAVY}}>CREATIVE MIND MAP</div>
      <h1 style={{margin:"6px 0 0",fontSize:34,fontWeight:900,color:NAVY,lineHeight:1.05,letterSpacing:-1}}>나의 성향 밸런스 진단</h1>
      <p style={{margin:"14px 0 0",fontSize:14,fontWeight:700,lineHeight:1.7}}>
        좋아하는 것에는 대단한 힘이 숨어 있습니다.<br/>
        무엇을 좋아하고 어떻게 반응하는지 따라가면,<br/>
        <b style={{color:CORAL}}>나만의 창작 프로필</b>이 보입니다. (약 3~5분)
      </p>
      <div style={{marginTop:22,display:"flex",flexDirection:"column",gap:10,maxWidth:320}}>
        <input placeholder="이름" value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})}
          style={inp}/>
        <input placeholder="학교 (선택)" value={profile.school} onChange={e=>setProfile({...profile,school:e.target.value})}
          style={inp}/>
      </div>
      <button className="btn" onClick={onStart}
        style={{marginTop:22,background:NAVY,color:"#fff",padding:"14px 40px",fontSize:15}}>
        시작하기
      </button>
    </div>
  </Card>;
}
const inp={border:`2px solid ${LINE}`,borderRadius:12,padding:"11px 14px",fontSize:14,outline:"none",fontFamily:"inherit"};

function StepLikes({likes,setLikes}){
  const toggle=(ax,i)=>{const k=`${ax}__${i}`; setLikes(p=>({...p,[k]:!p[k]}));};
  return <Card>
    <Head n="01" title="좋아하는 것 · 해보고 싶은 것"
      desc="마음이 가는 것을 모두 눌러 보세요. 많이 고를수록 성향이 또렷해집니다."/>
    {AXES.map(a=>(
      <div key={a.key} style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:800,color:a.color,marginBottom:7,display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:a.color}}/>{a.label}
          <span style={{color:"#aab",fontWeight:600,fontSize:11}}>· {a.group}</span>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {POOL_BY_AXIS[a.key].map((l,i)=>{
            const on=likes[`${a.key}__${i}`];
            return <span key={i} className="chip" onClick={()=>toggle(a.key,i)}
              style={{border:`2px solid ${on?a.color:LINE}`,background:on?a.color:"#fff",
                color:on?"#fff":INK,borderRadius:999,padding:"7px 12px",fontSize:12.5,fontWeight:700}}>{l}</span>;
          })}
        </div>
      </div>
    ))}
  </Card>;
}

function StepSituations({answers,setAnswers}){
  return <Card>
    <Head n="02" title="상황 표현 체크리스트"
      desc="각 상황에서 가장 나에게 가까운 것 하나를 고르세요. 정답은 없습니다. (20문항)"/>
    {Q.map((q,qi)=>(
      <div key={qi} style={{marginBottom:14,paddingBottom:14,borderBottom:qi<Q.length-1?`1px solid ${SOFT}`:"none"}}>
        <div style={{fontSize:14,fontWeight:800,marginBottom:8}}>
          <span style={{display:"inline-flex",width:20,height:20,borderRadius:"50%",background:NAVY,color:"#fff",
            fontSize:11,fontWeight:900,alignItems:"center",justifyContent:"center",marginRight:7}}>{qi+1}</span>
          {q[0]}
        </div>
        <div className="grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,paddingLeft:27}}>
          {q[1].map(([label,ax],oi)=>{
            const on=answers[qi]===ax;
            const col=AX[ax].color;
            return <span key={oi} className="chip" onClick={()=>setAnswers(p=>({...p,[qi]:ax}))}
              style={{border:`2px solid ${on?col:LINE}`,background:on?col:"#fff",color:on?"#fff":INK,
                borderRadius:10,padding:"9px 12px",fontSize:12.5,fontWeight:600}}>{label}</span>;
          })}
        </div>
      </div>
    ))}
  </Card>;
}

function RadarSVG({radar,radarPath,scores,maxAxis,size=280}){
  return <svg width={size} height={size} viewBox="-30 -20 340 320">
    {[0.33,0.66,1].map((f,i)=>(
      <polygon key={i} fill="none" stroke="#e3e7f0" strokeWidth="1"
        points={radar.pts.map(p=>`${radar.cx+(p.ax-radar.cx)*f},${radar.cy+(p.ay-radar.cy)*f}`).join(" ")}/>
    ))}
    {radar.pts.map((p,i)=><line key={i} x1={radar.cx} y1={radar.cy} x2={p.ax} y2={p.ay} stroke="#e3e7f0" strokeWidth="1"/>)}
    <path d={radarPath} fill={NAVY} fillOpacity="0.15" stroke={NAVY} strokeWidth="2.5"/>
    {radar.pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="4" fill={p.a.color}/>)}
    {radar.pts.map((p,i)=>(
      <text key={i} x={p.lx} y={p.ly} fontSize="12" fontWeight="800" fill={p.a.color}
        textAnchor={p.lx<radar.cx-5?"end":p.lx>radar.cx+5?"start":"middle"} dominantBaseline="middle">{p.a.label}</text>
    ))}
  </svg>;
}

function StepBalance({scores,groupScores,maxAxis,radar,radarPath,topGroup}){
  const total=Object.values(scores).reduce((a,b)=>a+b,0);
  return <Card>
    <Head n="03" title="나의 성향 밸런스" desc="지금까지 고른 것이 6개 성향, 3개 그룹으로 모였습니다."/>
    {total<1
      ? <p style={{textAlign:"center",padding:"30px 0",color:MUTED,fontWeight:600}}>이전 단계에서 항목을 골라주세요.</p>
      : <>
        <div style={{display:"flex",gap:10,marginBottom:20}}>
          {groupScores.map(g=>(
            <div key={g.key} style={{flex:1,textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:800,color:g.color}}>{g.key}</div>
              <div style={{height:110,background:SOFT,borderRadius:12,display:"flex",alignItems:"flex-end",overflow:"hidden",marginTop:6}}>
                <div style={{width:"100%",height:`${Math.max(g.pct,4)}%`,background:g.color,transition:"height .5s"}}/>
              </div>
              <div style={{fontSize:22,fontWeight:900,color:g.color,marginTop:6}}>{g.pct}%</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap",alignItems:"center",justifyContent:"center"}}>
          <RadarSVG {...{radar,radarPath,scores,maxAxis}}/>
          <div style={{flex:1,minWidth:230}}>
            {AXES.map(a=>(
              <div key={a.key} style={{marginBottom:9}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,marginBottom:3}}>
                  <span style={{color:a.color}}>{a.label}</span><span style={{color:a.color}}>{scores[a.key]}</span>
                </div>
                <div style={{height:9,background:SOFT,borderRadius:6,overflow:"hidden"}}>
                  <div style={{width:`${scores[a.key]/maxAxis*100}%`,height:"100%",background:a.color,transition:"width .5s"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>}
  </Card>;
}

function StepTracks({tracks,setTracks}){
  return <Card>
    <Head n="04" title="관심 있는 조형 과정" desc="어떤 만들기 방식이 끌리나요? 끌리는 트랙을 모두 고르세요."/>
    <div className="grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      {TRACKS.map(t=>{
        const on=tracks[t.ko];
        return <div key={t.ko} className="chip" onClick={()=>setTracks(p=>({...p,[t.ko]:!p[t.ko]}))}
          style={{border:`2px solid ${on?t.color:LINE}`,background:on?t.color:"#fff",color:on?"#fff":INK,
            borderRadius:14,padding:"14px 16px"}}>
          <div style={{fontSize:15,fontWeight:900}}>{t.ko}</div>
          <div style={{fontSize:10,fontWeight:800,opacity:.8,letterSpacing:.5}}>{t.en}</div>
        </div>;
      })}
    </div>
  </Card>;
}

function StepDetails({tracks,details,setDetails}){
  const active=TRACKS.filter(t=>tracks[t.ko]);
  const list=active.length?active:TRACKS;
  return <Card>
    <Head n="05" title="디테일 조형과정 선택"
      desc={active.length?"고른 트랙 안에서 더 해보고 싶은 과정을 고르세요.":"먼저 트랙을 고르면 좁혀집니다. 지금은 전체가 보입니다."}/>
    {list.map(t=>(
      <div key={t.ko} style={{marginBottom:14}}>
        <div style={{fontSize:12.5,fontWeight:800,color:t.color,marginBottom:7,display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:t.color}}/>{t.ko}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {t.detail.map((it,i)=>{
            const k=`${t.ko}::${it}`; const on=details[k];
            return <span key={i} className="chip" onClick={()=>setDetails(p=>({...p,[k]:!p[k]}))}
              style={{border:`2px solid ${on?t.color:LINE}`,background:on?t.color:"#fff",color:on?"#fff":INK,
                borderRadius:999,padding:"7px 12px",fontSize:12.5,fontWeight:600}}>{it}</span>;
          })}
        </div>
      </div>
    ))}
  </Card>;
}

function StepThemes({themes,setThemes}){
  return <Card>
    <Head n="06" title="내가 끌리는 주제 · 컨셉"
      desc="재료를 넘어, 무엇을 표현하고 싶은지가 진짜 나의 색깔입니다. 끌리는 세계를 모두 고르세요."/>
    <div className="grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      {THEMES.map(t=>{
        const on=themes[t.name];
        return <div key={t.name} className="chip" onClick={()=>setThemes(p=>({...p,[t.name]:!p[t.name]}))}
          style={{border:`2px solid ${on?t.color:LINE}`,background:on?`${t.color}12`:"#fff",
            borderLeft:`5px solid ${t.color}`,borderRadius:12,padding:"12px 14px"}}>
          <div style={{fontSize:15,fontWeight:900,color:t.color}}>{t.name}</div>
          <div style={{fontSize:11,fontWeight:600,color:"#6b7285",marginTop:2}}>{t.desc}</div>
        </div>;
      })}
    </div>
  </Card>;
}

function StepDopa({dopa,setDopa}){
  const labels=["전혀","아니다","보통","그렇다","매우"];
  return <Card>
    <Head n="07" title="무엇이 나를 채우는가 · 만족 유형"
      desc="창작할 때 어떤 순간이 가장 뿌듯한지 알면 지치지 않고 오래 즐길 수 있습니다. 각 문장이 나와 얼마나 맞나요?"/>
    {DOPA.map(d=>(
      <div key={d.key} style={{marginBottom:16}}>
        <div style={{fontSize:13.5,fontWeight:700,marginBottom:8}}>
          <b style={{color:d.color,marginRight:8}}>{d.key}</b>{d.q}
        </div>
        <div style={{display:"flex",gap:6,justifyContent:"space-between",maxWidth:420}}>
          {[1,2,3,4,5].map(v=>{
            const on=dopa[d.key]===v;
            return <div key={v} style={{flex:1,textAlign:"center"}}>
              <div className="chip" onClick={()=>setDopa(p=>({...p,[d.key]:v}))}
                style={{width:34,height:34,margin:"0 auto",borderRadius:"50%",
                  border:`2px solid ${on?d.color:LINE}`,background:on?d.color:"#fff",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color:on?"#fff":MUTED,fontWeight:800,fontSize:13}}>{v}</div>
              <div style={{fontSize:9,color:MUTED,fontWeight:700,marginTop:3}}>{labels[v-1]}</div>
            </div>;
          })}
        </div>
      </div>
    ))}
  </Card>;
}

const StepResult = React.forwardRef(function StepResult(
  {profile,groupScores,radar,radarPath,scores,maxAxis,topGroup,topTrack,topThemes,topDopa,recs,saveImage,saving},ref){
  return <div>
    <Card ref={ref}>
      <div style={{textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:12,fontWeight:800,letterSpacing:1.2,color:NAVY}}>CREATIVE MIND MAP · RESULT</div>
        <h2 style={{margin:"6px 0 0",fontSize:24,fontWeight:900,color:NAVY}}>
          {profile.name||"나"}의 창작 프로필
        </h2>
      </div>

      <div style={{display:"flex",gap:10,marginBottom:20}}>
        {groupScores.map(g=>(
          <div key={g.key} style={{flex:1,textAlign:"center"}}>
            <div style={{fontSize:12,fontWeight:800,color:g.color}}>{g.key}</div>
            <div style={{fontSize:24,fontWeight:900,color:g.color}}>{g.pct}%</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
        <RadarSVG {...{radar,radarPath,scores,maxAxis,size:260}}/>
      </div>

      {/* 프로필 문장 */}
      <div style={{background:`${(GROUPS.find(g=>g.key===topGroup)||{}).color||NAVY}12`,
        border:`2px solid ${(GROUPS.find(g=>g.key===topGroup)||{}).color||NAVY}`,
        borderRadius:14,padding:"16px 18px",marginTop:8,fontSize:15,fontWeight:700,lineHeight:1.8}}>
        나는 <b style={{color:NAVY}}>{topGroup||"—"}</b> 성향이 강하고,
        {topThemes.length? <> <b style={{color:CORAL}}>{topThemes.slice(0,2).join(", ")}</b> 주제에 끌린다.</> : " 다양한 주제에 열려 있다."}<br/>
        {topTrack? <><b style={{color:TEAL}}>{topTrack}</b> 방식으로 표현할 때 즐겁고, </> : ""}
        {topDopa? <><b style={{color:GOLD}}>{topDopa}</b>의 순간에 가장 큰 만족을 느낀다.</> : "나만의 만족을 찾아가는 중이다."}
      </div>

      {/* ESAD 추천 */}
      <div style={{marginTop:20}}>
        <div style={{fontSize:14,fontWeight:900,color:NAVY,marginBottom:10}}>나에게 맞는 ESAD 프로그램</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {recs.map((r,i)=>(
            <div key={i} style={{border:`1.5px solid ${LINE}`,borderRadius:12,padding:"12px 14px"}}>
              <div style={{fontSize:14,fontWeight:800,color:NAVY}}>{r.t}</div>
              <div style={{fontSize:12,color:"#6b7285",fontWeight:600,marginTop:3}}>{r.d}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>

    <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
      <button className="btn" onClick={saveImage} disabled={saving}
        style={{flex:1,minWidth:160,background:saving?"#c9b98a":GOLD,color:"#fff",padding:"14px",fontSize:14,
          cursor:saving?"default":"pointer"}}>
        {saving?"저장 중…":"결과 이미지 저장"}
      </button>
      <button className="btn" onClick={()=>{
          const url=window.location.href;
          if(navigator.share) navigator.share({title:"ESAD 성향 진단",url});
          else { navigator.clipboard?.writeText(url); alert("링크가 복사되었습니다."); }
        }}
        style={{flex:1,minWidth:160,background:NAVY,color:"#fff",padding:"14px",fontSize:14}}>
        공유하기
      </button>
    </div>
    <div style={{textAlign:"center",marginTop:16}}>
      <a href="https://instagram.com/h_esad_art_studio" target="_blank" rel="noreferrer"
        style={{fontSize:13,fontWeight:800,color:CORAL,textDecoration:"none"}}>
        → ESAD 상담 예약하고 더 알아보기
      </a>
    </div>
  </div>;
});
