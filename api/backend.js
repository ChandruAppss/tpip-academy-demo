// Single Vercel serverless function for all /api/lms/* routes
const now = new Date();
const d    = (n,h,m) => { const x=new Date(now); x.setDate(x.getDate()+n); x.setHours(h,m,0,0); return x.toISOString(); };
const past = (n,h,m) => { const x=new Date(now); x.setDate(x.getDate()-n); x.setHours(h,m,0,0); return x.toISOString(); };

const USERS = {
  'onlinephone234@gmail.com': {id:'1',email:'onlinephone234@gmail.com',full_name:'Arjun Kumar', role:'student',password:'student1234'},
  'rahul.coach@tpip.com':     {id:'2',email:'rahul.coach@tpip.com',    full_name:'Rahul Sharma',role:'coach',  password:'coach1234'},
  'vampirerocks123@gmail.com':{id:'3',email:'vampirerocks123@gmail.com',full_name:'Admin User', role:'admin',  password:'LiCreative9791'},
};
const S=[
  {id:'s1', profile:{full_name:'Arjun Kumar',  email:'arjun@x.com', is_active:true }, level:'Advanced',    playing_role:'Batsman',      programs:2},
  {id:'s2', profile:{full_name:'Priya Patel',  email:'priya@x.com', is_active:true }, level:'Intermediate',playing_role:'All-rounder',  programs:1},
  {id:'s3', profile:{full_name:'Rohit Verma',  email:'rohit@x.com', is_active:true }, level:'Advanced',    playing_role:'Fast Bowler',  programs:3},
  {id:'s4', profile:{full_name:'Sneha Iyer',   email:'sneha@x.com', is_active:false}, level:'Beginner',    playing_role:'Wicket-keeper',programs:1},
  {id:'s5', profile:{full_name:'Kiran Nair',   email:'kiran@x.com', is_active:true }, level:'Intermediate',playing_role:'Batsman',      programs:2},
  {id:'s6', profile:{full_name:'Amit Sharma',  email:'amit@x.com',  is_active:true }, level:'Advanced',    playing_role:'Spin Bowler',  programs:2},
  {id:'s7', profile:{full_name:'Divya Menon',  email:'divya@x.com', is_active:true }, level:'Beginner',    playing_role:'Batsman',      programs:1},
  {id:'s8', profile:{full_name:'Ravi Teja',    email:'ravi@x.com',  is_active:true }, level:'Intermediate',playing_role:'All-rounder',  programs:2},
  {id:'s9', profile:{full_name:'Meena Reddy',  email:'meena@x.com', is_active:false}, level:'Beginner',    playing_role:'Fast Bowler',  programs:1},
  {id:'s10',profile:{full_name:'Sanjay Gupta', email:'sanjay@x.com',is_active:true }, level:'Advanced',    playing_role:'Batsman',      programs:3},
  {id:'s11',profile:{full_name:'Pooja Singh',  email:'pooja@x.com', is_active:true }, level:'Intermediate',playing_role:'Spin Bowler',  programs:2},
  {id:'s12',profile:{full_name:'Yash Malhotra',email:'yash@x.com',  is_active:true }, level:'Advanced',    playing_role:'Wicket-keeper',programs:1},
];
const C=[
  {id:'c1',profile:{full_name:'Rahul Sharma'},name:'Rahul Sharma',specialization:'Batting',       experience:'12 years',rating:4.9,students:45,fee_inr:2500},
  {id:'c2',profile:{full_name:'Vikram Singh'},name:'Vikram Singh',specialization:'Bowling',        experience:'10 years',rating:4.8,students:38,fee_inr:2200},
  {id:'c3',profile:{full_name:'Priya Nair'},  name:'Priya Nair',  specialization:'Fielding',       experience:'8 years', rating:4.7,students:32,fee_inr:2000},
  {id:'c4',profile:{full_name:'Suresh Raina'},name:'Suresh Raina',specialization:'All-round',      experience:'15 years',rating:5.0,students:60,fee_inr:3500},
  {id:'c5',profile:{full_name:'Anita Kapoor'},name:'Anita Kapoor',specialization:'Wicket-keeping', experience:'9 years', rating:4.6,students:25,fee_inr:1800},
];
const P=[
  {id:'p1',title:'Elite Batting Masterclass',  instructor:'Rahul Sharma',total_enrollments:24,max_students:30,duration_weeks:8, rating:4.9,price_inr:12000},
  {id:'p2',title:'Fast Bowling Intensive',      instructor:'Vikram Singh',total_enrollments:18,max_students:25,duration_weeks:6, rating:4.8,price_inr:10000},
  {id:'p3',title:'Fielding Excellence Program', instructor:'Priya Nair',  total_enrollments:32,max_students:40,duration_weeks:10,rating:4.7,price_inr:8000},
  {id:'p4',title:'Complete Cricket Foundation', instructor:'Suresh Raina',total_enrollments:55,max_students:60,duration_weeks:12,rating:5.0,price_inr:15000},
  {id:'p5',title:'Advanced Wicket-keeping',     instructor:'Anita Kapoor',total_enrollments:12,max_students:20,duration_weeks:6, rating:4.6,price_inr:9500},
];
const SE=[
  {id:'ses1',title:'Batting Technique Review',   scheduled_at:d(0,10,0),   duration_minutes:60, status:'scheduled',coach:{profile:{full_name:'Rahul Sharma'}},max_students:1, zoom_link:'https://zoom.us/j/demo1'},
  {id:'ses2',title:'Fielding & Agility Drills',  scheduled_at:d(0,14,30),  duration_minutes:45, status:'scheduled',coach:{profile:{full_name:'Priya Nair'}},  max_students:6, zoom_link:null},
  {id:'ses3',title:'Bowling Analysis Session',   scheduled_at:d(1,10,0),   duration_minutes:90, status:'scheduled',coach:{profile:{full_name:'Vikram Singh'}}, max_students:1, zoom_link:'https://zoom.us/j/demo3'},
  {id:'ses4',title:'Fitness & Strength Training',scheduled_at:d(2,7,30),   duration_minutes:60, status:'scheduled',coach:{profile:{full_name:'Rahul Sharma'}}, max_students:8, zoom_link:null},
  {id:'ses5',title:'Match Preparation Workshop', scheduled_at:d(3,9,30),   duration_minutes:120,status:'scheduled',coach:{profile:{full_name:'Suresh Raina'}}, max_students:12,zoom_link:'https://zoom.us/j/demo5'},
  {id:'ses6',title:'Spin Bowling Masterclass',   scheduled_at:d(4,11,0),   duration_minutes:60, status:'scheduled',coach:{profile:{full_name:'Vikram Singh'}}, max_students:4, zoom_link:null},
  {id:'ses7',title:'Video Analysis: Batting',    scheduled_at:past(1,10,0),duration_minutes:45, status:'completed',coach:{profile:{full_name:'Rahul Sharma'}}, max_students:1, zoom_link:null},
  {id:'ses8',title:'Net Practice Session',       scheduled_at:past(2,9,0), duration_minutes:90, status:'completed',coach:{profile:{full_name:'Priya Nair'}},   max_students:3, zoom_link:null},
  {id:'ses9',title:'Wicket-keeping Basics',      scheduled_at:past(3,15,0),duration_minutes:60, status:'completed',coach:{profile:{full_name:'Anita Kapoor'}}, max_students:2, zoom_link:null},
];
const SB=[
  {id:'sub1',title:'Pull Shot Practice',   description:'Back-foot placement on pull shot.',       status:'pending', coach_feedback:null,  created_at:past(1,14,0),submitted_at:past(1,14,0),student:{profile:{full_name:'Arjun Kumar'}}},
  {id:'sub2',title:'Cover Drive Technique',description:'Trying the new grip you suggested.',       status:'reviewed',coach_feedback:'Great improvement on the elbow position! Keep the lead shoulder closed a bit more. Your head is perfectly still now — huge progress.', created_at:past(4,11,0),submitted_at:past(4,11,0),student:{profile:{full_name:'Priya Patel'}}},
  {id:'sub3',title:'Bowling Run-Up',       description:'Run-up feels unbalanced at delivery.',     status:'pending', coach_feedback:null,  created_at:past(0,9,0), submitted_at:past(0,9,0), student:{profile:{full_name:'Kiran Nair'}}},
  {id:'sub4',title:'Sweep Shot Analysis',  description:'Playing against spin in the nets.',        status:'reviewed',coach_feedback:'Your length judgment is excellent. Front knee needs to drop earlier — sweeping high reduces control. Great overall.',created_at:past(7,16,0),submitted_at:past(7,16,0),student:{profile:{full_name:'Rohit Verma'}}},
  {id:'sub5',title:'Defensive Technique',  description:'Forward defensive vs left-arm orthodox.', status:'pending', coach_feedback:null,  created_at:past(0,17,0),submitted_at:past(0,17,0),student:{profile:{full_name:'Amit Sharma'}}},
];
const EN=[
  {id:'enr1',progress_pct:62,course:{title:'Elite Batting Masterclass'}, program:{name:'Elite Batting Masterclass'}, coach:{profile:{full_name:'Rahul Sharma'}}},
  {id:'enr2',progress_pct:28,course:{title:'Fielding Excellence Program'},program:{name:'Fielding Excellence Program'},coach:{profile:{full_name:'Priya Nair'}}},
];
const PAY=[
  {id:'pay1',student_name:'Arjun Kumar', program:'Elite Batting Masterclass', amount_inr:12000,status:'paid',   date:past(5,10,0)},
  {id:'pay2',student_name:'Priya Patel', program:'Fielding Excellence',       amount_inr:8000, status:'paid',   date:past(10,11,0)},
  {id:'pay3',student_name:'Rohit Verma', program:'Fast Bowling Intensive',    amount_inr:10000,status:'paid',   date:past(3,9,0)},
  {id:'pay4',student_name:'Kiran Nair',  program:'Elite Batting Masterclass', amount_inr:12000,status:'pending',date:past(1,14,0)},
  {id:'pay5',student_name:'Sanjay Gupta',program:'Complete Cricket Foundation',amount_inr:15000,status:'paid',  date:past(8,10,0)},
];
const YT=[
  {id:'yt1',title:'Batting Footwork Masterclass',  url:'https://youtube.com/watch?v=dQw4w9WgXcQ',category:'Batting', tags:['footwork','batting']},
  {id:'yt2',title:'Fast Bowling Run-Up Guide',      url:'https://youtube.com/watch?v=dQw4w9WgXcQ',category:'Bowling', tags:['bowling','run-up']},
  {id:'yt3',title:'Pull Shot Technique',            url:'https://youtube.com/watch?v=dQw4w9WgXcQ',category:'Batting', tags:['pull','hook','short']},
  {id:'yt4',title:'Fielding Drills for Beginners',  url:'https://youtube.com/watch?v=dQw4w9WgXcQ',category:'Fielding',tags:['fielding','catching']},
];
const PKGS=[{id:'free',name:'Free',daily_limit:5,price_inr:0},{id:'basic',name:'Basic',daily_limit:15,price_inr:499},{id:'pro',name:'Pro',daily_limit:50,price_inr:1499},{id:'unlimited',name:'Unlimited',daily_limit:-1,price_inr:2999}];
const PAYOUT_SETTINGS={platform_fee_pct:10,default_schedule:'biweekly',razorpay_key_id:'',razorpay_key_secret:'',stripe_publishable_key:'',stripe_secret_key:'',auto_release:false};
const COACH_AVAILABILITY={c1:[{day:'Mon',slots:['09:00','10:00','11:00','14:00','15:00']},{day:'Wed',slots:['09:00','10:00','11:00','14:00','15:00','16:00']},{day:'Fri',slots:['10:00','11:00','14:00','15:00']}],c2:[{day:'Tue',slots:['09:00','10:00','11:00','14:00']},{day:'Thu',slots:['09:00','10:00','14:00','15:00','16:00']},{day:'Sat',slots:['09:00','10:00','11:00']}],c3:[{day:'Mon',slots:['11:00','14:00','15:00','16:00']},{day:'Wed',slots:['09:00','10:00','11:00']},{day:'Fri',slots:['14:00','15:00','16:00','17:00']}]};
const COACH_PACKAGES=[{id:'pkg1',coach_id:'c1',coach_name:'Rahul Sharma',title:'Elite Batting Masterclass',sessions:16,duration_weeks:8,price_inr:12000,price_usd:145,price_gbp:115,price_aed:532,description:'Complete batting technique overhaul — cover drive, pull shot, footwork. 16 one-on-one video sessions.',specialty:'Batting'},{id:'pkg2',coach_id:'c2',coach_name:'Vikram Singh',title:'Fast Bowling Intensive',sessions:10,duration_weeks:6,price_inr:9500,price_usd:115,price_gbp:91,price_aed:422,description:'Run-up mechanics, seam position, yorker mastery. 10 sessions with video analysis.',specialty:'Bowling'},{id:'pkg3',coach_id:'c3',coach_name:'Priya Nair',title:'Fielding Excellence',sessions:8,duration_weeks:4,price_inr:7000,price_usd:85,price_gbp:67,price_aed:312,description:'Agility, catching, and throwing drills. 8 high-intensity sessions.',specialty:'Fielding'},{id:'pkg4',coach_id:'c1',coach_name:'Rahul Sharma',title:'Batting Basics (Starter)',sessions:6,duration_weeks:3,price_inr:5500,price_usd:67,price_gbp:53,price_aed:245,description:'Perfect for beginners. Covers stance, grip, and basic drives in 6 sessions.',specialty:'Batting'}];
const BOOKINGS=[{id:'bk1',student_id:'1',student_name:'Arjun Kumar',coach_id:'c1',coach_name:'Rahul Sharma',package_id:'pkg1',session_date:'2026-06-02',session_time:'10:00',topic:'Cover Drive Technique',type:'video',status:'confirmed',payment_status:'held',amount_inr:750,currency:'INR',amount_local:750,created_at:'2026-05-28T09:00:00Z'},{id:'bk2',student_id:'1',student_name:'Arjun Kumar',coach_id:'c2',coach_name:'Vikram Singh',package_id:'pkg2',session_date:'2026-06-04',session_time:'14:00',topic:'Yorker Training',type:'video',status:'confirmed',payment_status:'held',amount_inr:950,currency:'INR',amount_local:950,created_at:'2026-05-29T10:00:00Z'},{id:'bk3',student_id:'1',student_name:'Arjun Kumar',coach_id:'c1',coach_name:'Rahul Sharma',package_id:'pkg1',session_date:'2026-05-20',session_time:'10:00',topic:'Batting Stance',type:'video',status:'completed',payment_status:'released',amount_inr:750,currency:'INR',amount_local:750,created_at:'2026-05-15T09:00:00Z'}];
const PAYOUT_REQUESTS=[{id:'pr1',coach_id:'c1',coach_name:'Rahul Sharma',amount:6750,currency:'INR',schedule:'biweekly',status:'pending',requested_at:'2026-05-29T10:00:00Z',sessions_count:9},{id:'pr2',coach_id:'c2',coach_name:'Vikram Singh',amount:4275,currency:'INR',schedule:'monthly',status:'approved',requested_at:'2026-05-15T09:00:00Z',sessions_count:5,approved_at:'2026-05-16T11:00:00Z'}];
const COACH_EARNINGS={c1:{pending_inr:6750,released_inr:13500,schedule:'biweekly',bank_account:'****4521',currency:'INR'},c2:{pending_inr:4275,released_inr:9500,schedule:'monthly',bank_account:'****8832',currency:'INR'},c3:{pending_inr:2100,released_inr:3500,schedule:'biweekly',bank_account:'****2219',currency:'INR'}};
const CURRENCY_MAP={IN:'INR',US:'USD',GB:'GBP',AE:'AED',AU:'AUD',SG:'SGD',CA:'CAD',DE:'EUR',FR:'EUR',NL:'EUR',NZ:'NZD',ZA:'ZAR',PK:'PKR',LK:'LKR',BD:'BDT'};

function ai(){return{overall_rating:7.2,performance_level:'Competitive Club Level',summary:'Strong batting foundation with excellent footwork. Consistent improvement in drive technique. Key focus: short-pitch play and back-foot positioning.',monthly_focus:'Back-Foot Play & Short-Pitch Defence',strengths:[{skill:'Cover Drive',score:'8.5',detail:'Coach noted significant improvement in elbow position and head stillness.'},{skill:'Running Between Wickets',score:'8.0',detail:'Excellent game awareness. No run-outs in last 12 innings.'},{skill:'Sweep Shot',score:'7.5',detail:'Good length judgment vs spin bowling.'}],weaknesses:[{skill:'Pull Shot',priority:'Critical',detail:'Back-foot placement inconsistent. Getting bowled on short-pitch.'},{skill:'Bowling Line',priority:'High',detail:'Falling off-side during delivery stride.'},{skill:'Sweep Position',priority:'Medium',detail:'Front knee not dropping early enough.'}],drills:[{name:'Back-Foot Anchor Drill',description:'50 pull shots with foot on marker.',duration:'20 min daily',targets:'Pull shot'},{name:'Run-Up Balance',description:'Land straight foot, 50 reps.',duration:'15 min 3x/wk',targets:'Bowling'},{name:'Knee-Drop Sweep',description:'Shadow bat 30 reps with bent knee.',duration:'10 min daily',targets:'Sweep'}],prediction:'District-level selection realistic in 3 months.',coach_message:'Fix the back-foot play and you have a genuine shot at the district trials.'};}

function reply(msg){const q=(msg||'').toLowerCase();if(q.includes('pull')||q.includes('short'))return'Pull Shot is Critical priority. Back-Foot Anchor Drill: 50 shots with foot marker, 20 min daily.';if(q.includes('bowl'))return'Run-up balance: practice delivery stride landing 50x with eyes closed.';if(q.includes('drill'))return'Top drills: 1. Back-Foot Anchor (20min daily) 2. Cover Drive Shadow (30 reps) 3. Knee-Drop Sweep (10min daily)';return'You are at 7.2/10 (Competitive Club Level). Cover Drive improved per coach. Priority: fix the pull shot.';}

function json(res,status,data){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
  res.setHeader('Content-Type','application/json');
  res.status(status).end(JSON.stringify(data));
}

function getBody(req){
  if(req.body&&typeof req.body==='object'&&Object.keys(req.body).length>0)return Promise.resolve(req.body);
  return new Promise(r=>{let s='';req.on('data',c=>{s+=c;});req.on('end',()=>{try{r(s?JSON.parse(s):{});}catch(_){r({});}});req.on('error',()=>r({}));});
}

export default async function handler(req,res){
  if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');return res.status(200).end();}

  // Extract the /api/lms sub-path from original URL
  const p=decodeURIComponent(req.url.split('?')[0]).replace(/^\/api\/lms/,'')||'/';
  const m=req.method;

  try{
    const b=await getBody(req);

    // AUTH
    if(p==='/auth/login'&&m==='POST'){const u=USERS[b.email];if(!u||u.password!==b.password)return json(res,401,{error:'Invalid email or password'});return json(res,200,{token:'tok-'+u.id+'-'+Date.now(),profile:{id:u.id,email:u.email,full_name:u.full_name,role:u.role}});}
    if(p==='/auth/me')return json(res,200,{id:'1',email:'onlinephone234@gmail.com',full_name:'Arjun Kumar',role:'student'});
    if(p==='/auth/logout')return json(res,200,{message:'ok'});

    // ADMIN
    if(p==='/admin/dashboard')return json(res,200,{totalStudents:S.length,upcomingSessions:SE.filter(x=>x.status==='scheduled').length,totalRevenueInr:PAY.filter(x=>x.status==='paid').reduce((a,x)=>a+x.amount_inr,0),totalCoaches:C.length,newEnrollmentsThisMonth:8,pendingReviews:SB.filter(x=>!x.coach_feedback).length});
    if(p==='/admin/sessions')return json(res,200,SE);
    if(p==='/admin/students')return json(res,200,S);
    if(p==='/admin/coaches')return json(res,200,C);
    if(p==='/admin/programs')return json(res,200,P);
    if(p==='/admin/payments')return json(res,200,PAY);
    if(p==='/admin/certificates')return json(res,200,[{id:'ac1',student_name:'Arjun Kumar',program:'Cricket Foundation Basics',issued_at:past(60,10,0)}]);
    if(p==='/admin/academies')return json(res,200,[{id:'a1',name:'Delhi Cricket Academy',city:'Delhi',students:45,coaches:3}]);
    if(p==='/admin/ai-settings')return json(res,200,{provider:'anthropic',has_anthropic_key:false,has_openai_key:false,model_anthropic:'claude-3-5-haiku-20241022',model_openai:'gpt-4o-mini',packages:PKGS,youtube_resources:YT,suggested_packages:[{id:'sp1',title:'Elite Batting Masterclass',price_inr:12000,highlight:'Most Popular',cta_url:'/enroll?program=p1'}],system_prompt_prefix:'You are TPIP AI, an expert cricket performance coach.',student_packages:{s1:'pro',s2:'basic',s3:'pro',s4:'free',s5:'basic'}});
    if(p==='/admin/ai-usage')return json(res,200,{today:[],total_keys:{anthropic:false,openai:false}});

    // COACH
    if(p==='/coach/dashboard')return json(res,200,{totalStudents:S.length,upcomingSessions:SE.filter(x=>x.status==='scheduled').length,completedSessions:SE.filter(x=>x.status==='completed').length,pendingReviews:SB.filter(x=>!x.coach_feedback).length,totalEarnings:124500});
    if(p==='/coach/sessions')return json(res,200,SE);
    if(p==='/coach/students')return json(res,200,S);
    if(p==='/coach/submissions')return json(res,200,SB);
    if(p==='/coach/batches')return json(res,200,[{id:'b1',name:'Batch A',students:6}]);
    if(p==='/coach/courses')return json(res,200,P);
    if(p==='/coach/drills')return json(res,200,[{id:'d1',title:'Front-foot Drive Drill',category:'Batting',duration_min:20}]);
    if(p==='/coach/earnings')return json(res,200,{total:124500,this_month:28500});
    if(/^\/coach\/submissions\/.+\/feedback$/.test(p)&&m==='PUT')return json(res,200,{message:'Feedback saved'});
    if(p.startsWith('/coach/students/')){const x=S.find(s=>s.id===p.split('/')[3])||S[0];return json(res,200,x);}

    // STUDENT
    if(p==='/student/dashboard')return json(res,200,{activeEnrollments:EN,upcomingSessions:SE.filter(x=>x.status==='scheduled').length,sessionsCompleted:SE.filter(x=>x.status==='completed').length,practiceSubmissions:SB.length,todaySession:SE.find(x=>new Date(x.scheduled_at).toDateString()===new Date().toDateString()&&x.status==='scheduled')||null});
    if(p==='/student/sessions')return json(res,200,SE);
    if(p==='/student/submissions')return json(res,200,SB.slice(0,3));
    if(p==='/student/certificates')return json(res,200,[{id:'c1',program:{name:'Cricket Foundation Basics'},issued_at:past(60,10,0)}]);
    if(p==='/student/courses')return json(res,200,EN);
    if(p==='/student/discover')return json(res,200,C);
    if(p.startsWith('/student/discover/')){const x=C.find(c=>c.id===p.split('/')[3])||C[0];return json(res,200,x);}
    if(p==='/student/notifications')return json(res,200,[{id:'n1',type:'session',message:'Your batting session is tomorrow at 10:00 AM',read:false,created_at:past(0,8,0)},{id:'n2',type:'feedback',message:'Rahul Sharma reviewed your Cover Drive submission',read:false,created_at:past(1,15,0)}]);
    if(p==='/student/assessments')return json(res,200,[{id:'a1',title:'Batting Fundamentals Quiz',due_date:d(2,23,59),status:'pending',score:null},{id:'a2',title:'Cricket Rules Test',due_date:d(7,23,59),status:'pending',score:null},{id:'a3',title:'Fielding Positions',due_date:past(5,0,0),status:'completed',score:82}]);
    if(p==='/student/ai-analysis')return json(res,200,{analysis:ai(),generated_at:new Date().toISOString(),source:'static'});
    if(p==='/student/ai-chat'&&m==='POST'){const r=reply(b.message);const t=((b.message||'')+r).toLowerCase();const sg=YT.filter(x=>x.tags.some(t2=>t.includes(t2))).slice(0,2);return json(res,200,{reply:r,suggested_resources:sg,questions_used:1,questions_remaining:49,limit:50,package:'Pro'});}

    if(p==='/detect-currency'){const country=req.headers['x-vercel-ip-country']||req.headers['cf-ipcountry']||'IN';const currency=CURRENCY_MAP[country]||'USD';const gateway=currency==='INR'?'razorpay':'stripe';return json(res,200,{country,currency,gateway,razorpay_key:PAYOUT_SETTINGS.razorpay_key_id,stripe_key:PAYOUT_SETTINGS.stripe_publishable_key});}
    if(p==='/packages')return json(res,200,COACH_PACKAGES);
    if(p.startsWith('/packages/coach/')){const cid=p.split('/')[3];return json(res,200,COACH_PACKAGES.filter(pk=>pk.coach_id===cid));}
    if(p==='/coach/availability'&&m==='GET')return json(res,200,COACH_AVAILABILITY['c1']||[]);
    if(p==='/coach/availability'&&m==='PUT'){COACH_AVAILABILITY['c1']=b.slots||[];return json(res,200,{message:'Availability updated'});}
    if(p.startsWith('/availability/')){const cid=p.split('/')[2];return json(res,200,COACH_AVAILABILITY[cid]||[]);}
    if(p==='/student/bookings'&&m==='GET')return json(res,200,BOOKINGS.filter(bk=>bk.student_id==='1'));
    if(p==='/student/bookings'&&m==='POST'){const bk={id:'bk_new',student_id:'1',student_name:'Arjun Kumar',...b,status:'pending_payment',payment_status:'pending',created_at:'2026-05-31T00:00:00Z'};BOOKINGS.push(bk);return json(res,201,bk);}
    if(p==='/student/bookings/confirm'&&m==='POST'){const bk=BOOKINGS.find(x=>x.id===b.booking_id);if(bk){bk.status='confirmed';bk.payment_status='held';bk.payment_id=b.payment_id||'pay_demo';}return json(res,200,{message:'Booking confirmed',booking:bk});}
    if(p==='/payments/razorpay/order'&&m==='POST'){const key=PAYOUT_SETTINGS.razorpay_key_id;const secret=PAYOUT_SETTINGS.razorpay_key_secret;if(!key||!secret){return json(res,200,{id:'order_demo',amount:(b.amount||750)*100,currency:b.currency||'INR',receipt:'rcpt_demo',demo:true});}return json(res,200,{id:'order_live',amount:(b.amount||750)*100,currency:b.currency||'INR',demo:false});}
    if(p==='/payments/stripe/intent'&&m==='POST'){const secret=PAYOUT_SETTINGS.stripe_secret_key;if(!secret){return json(res,200,{client_secret:'pi_demo_secret_demo',id:'pi_demo',demo:true});}return json(res,200,{client_secret:'pi_live_secret',id:'pi_live',demo:false});}
    if(p==='/admin/escrow')return json(res,200,{held:BOOKINGS.filter(bk=>bk.payment_status==='held'),total_held_inr:BOOKINGS.filter(bk=>bk.payment_status==='held').reduce((s,x)=>s+(x.amount_inr||0),0),total_released_inr:BOOKINGS.filter(bk=>bk.payment_status==='released').reduce((s,x)=>s+(x.amount_inr||0),0)});
    if(p==='/admin/payouts'&&m==='GET')return json(res,200,PAYOUT_REQUESTS);
    if(p==='/admin/payouts/approve'&&m==='POST'){const pr=PAYOUT_REQUESTS.find(r=>r.id===b.payout_id);if(pr){pr.status='approved';pr.approved_at='2026-05-31T12:00:00Z';}return json(res,200,{message:'Payout approved'});}
    if(p==='/admin/payouts/reject'&&m==='POST'){const pr=PAYOUT_REQUESTS.find(r=>r.id===b.payout_id);if(pr){pr.status='rejected';pr.rejection_note=b.note||'';}return json(res,200,{message:'Payout rejected'});}
    if(p==='/admin/escrow/release'&&m==='POST'){const bk=BOOKINGS.find(x=>x.id===b.booking_id);if(bk){bk.payment_status='released';const ce=COACH_EARNINGS[bk.coach_id];if(ce){ce.pending_inr=Math.max(0,(ce.pending_inr||0)-(bk.amount_inr||0));ce.released_inr=(ce.released_inr||0)+(bk.amount_inr||0);}}return json(res,200,{message:'Payment released to coach'});}
    if(p==='/admin/payout-settings'&&m==='GET')return json(res,200,PAYOUT_SETTINGS);
    if(p==='/admin/payout-settings'&&m==='PUT'){Object.assign(PAYOUT_SETTINGS,b);return json(res,200,{message:'Settings saved',...PAYOUT_SETTINGS});}
    if(p==='/coach/earnings'){const ce=COACH_EARNINGS['c1']||{};return json(res,200,{...ce,pending_bookings:BOOKINGS.filter(bk=>bk.coach_id==='c1'&&bk.payment_status==='held'),released_bookings:BOOKINGS.filter(bk=>bk.coach_id==='c1'&&bk.payment_status==='released'),payout_requests:PAYOUT_REQUESTS.filter(r=>r.coach_id==='c1')});}
    if(p==='/coach/payout-request'&&m==='POST'){const pr={id:'pr_new',coach_id:'c1',coach_name:'Rahul Sharma',...b,status:'pending',requested_at:'2026-05-31T00:00:00Z'};PAYOUT_REQUESTS.push(pr);return json(res,201,pr);}
    if(p==='/coach/payout-settings'&&m==='PUT'){const ce=COACH_EARNINGS['c1'];if(ce){ce.schedule=b.schedule||ce.schedule;ce.bank_account=b.bank_account||ce.bank_account;}return json(res,200,{message:'Payout settings saved'});}

    // PUBLIC
    if(p==='/programs')return json(res,200,P);
    if(p==='/coaches')return json(res,200,C);

    // POST/PUT ACK
    if(['POST','PUT'].includes(m))return json(res,m==='POST'?201:200,{message:'OK',id:'new_'+Date.now()});
    return json(res,404,{error:'Not found: '+p});
  }catch(e){console.error('[TPIP]',e.message);return json(res,500,{error:e.message});}
}
