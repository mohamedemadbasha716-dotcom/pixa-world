import 'server-only';
// Original Pixa activities. Topic coverage informed by Cambridge Pre-A1 wordlists.
// No Cambridge illustrations, exam questions or source prose are reproduced.
const choice=(id,prompt,ar,answer,options,extra={})=>({id,type:'choice',prompt,ar,answer,options,...extra});
const listen=(id,spoken,answer,options)=>choice(id,'Listen and choose.','اسمع، ثم اختار الإجابة.',answer,options,{spoken,listening:true});
const order=(id,prompt,ar,words,answer)=>({id,type:'order',prompt,ar,words,answer});
const count=(id,n)=>({id,type:'load',prompt:`Load ${['zero','one','two','three','four','five','six','seven','eight','nine','ten'][n]} stars.`,ar:'حمّل العدد المطلوب من النجوم، ثم أرسل القطار.',answer:n});
export const lessons=[
{id:'hello',name:'ميناء اللقاء',en:'Hello, friend!',icon:'☀',color:'#e9b251',x:11,y:68,goal:'تحيّي صديقًا وتعرّف نفسك.',vocab:[['Hello!','أهلًا'],['Goodbye!','مع السلامة'],["What is your name?",'ما اسمك؟'],['My name is Nora.','اسمي نورا.'],['friend','صديق']],tasks:[
choice('h1','Nora arrives at the harbour. What do you say?','نورا وصلت الميناء. تحيّيها بإيه؟','Hello!',['Goodbye!','Hello!','Thank you!'],{scene:'wave'}),
listen('h2','Hello!','Hello!',['Goodbye!','Hello!','My name is Nora.']),
choice('h3','Nora is leaving. What do you say?','نورا هتمشي. تقول إيه؟','Goodbye!',['Hello!','Goodbye!','My name is Nora.'],{scene:'bye'}),
order('h4','Introduce Nora.','رتّب كلام نورا عشان تعرّف نفسها.',['Nora.','is','My','name'],'My name is Nora.'),
choice('h5','My name is Omar. Which question did Omar answer?','عمر قال اسمه. كان بيرد على سؤال إيه؟','What is your name?',['How old are you?','What is your name?','What colour is it?']),
listen('h6','Goodbye!','Goodbye!',['Hello!','Goodbye!','friend']),
order('h7','Ask your new friend their name.','رتّب سؤال تعرف بيه اسم صديقك.',['name?','your','What','is'],'What is your name?'),
choice('h8','Nora says: Hello! Choose a friendly reply.','نورا بتحيّيك. اختار رد مناسب.','Hi, Nora!',['Goodbye, Nora!','Hi, Nora!','I am seven.'])]},
{id:'numbers',name:'قطار النجوم',en:'Count with me',icon:'✦',color:'#edbd68',x:48,y:69,goal:'تعدّ من ١ إلى ١٠ وتفهم سؤال السنّ.',vocab:[['one · two · three','١ · ٢ · ٣'],['four · five · six','٤ · ٥ · ٦'],['seven · eight · nine · ten','٧ · ٨ · ٩ · ١٠'],['How old are you?','كم عمرك؟'],['I am seven.','عمري سبع سنين.']],tasks:[count('n1',3),count('n2',5),listen('n3','eight','8',['6','8','10']),count('n4',2),choice('n5','Omar says: I am seven. How old is Omar?','عمر قال: I am seven. اختار عمره.','7',['5','7','9']),order('n6','Nora is six. Introduce her age.','نورا عندها ست سنين. رتّب جملتها.',['six.','am','I'],'I am six.'),count('n7',10),listen('n8','four','4',['4','5','9'])]},
{id:'family',name:'بيت الأصدقاء',en:'Meet the family',icon:'⌂',color:'#e7a876',x:47,y:37,goal:'تتعرف على كلمات الأسرة من قصة خيالية.',vocab:[['mother · father','أم · أب'],['sister · brother','أخت · أخ'],['grandmother · grandfather','جدّة · جدّ'],['baby · family','طفل رضيع · أسرة'],['This is my family.','هذه أسرتي.']],tasks:[
choice('f1','This is my mother. Choose the matching word.','في قصة نورا: دي ماما. اختار الكلمة.','mother',['father','mother','brother'],{scene:'mother'}),
listen('f2','brother','brother',['sister','brother','baby']),
choice('f3','Nora introduces her sister. Complete: This is my ___.','نورا بتعرّف أختها. كمّل كلامها.','sister',['grandfather','father','sister'],{scene:'sister'}),
order('f4','Introduce the family.','رتّب الجملة.',['family.','is','This','my'],'This is my family.'),
listen('f5','grandmother','grandmother',['grandfather','grandmother','mother']),
choice('f6','Omar says: This is my father. Who is he introducing?','عمر قال: This is my father. بيتكلم عن مين؟','الأب',['الأخ','الأب','الجدّة']),
listen('f7','baby','baby',['baby','sister','father']),
choice('f8','Which word means جدّ?','ساعد نورا تحط بطاقة الجدّ في مكانها.','grandfather',['grandmother','grandfather','brother'])]},
{id:'colours',name:'حديقة الألوان',en:'Paint the journey',icon:'✿',color:'#bba2f4',x:66,y:25,goal:'تتعرف على ٨ ألوان وتوصف لون شيء.',vocab:[['red · blue','أحمر · أزرق'],['green · yellow','أخضر · أصفر'],['black · white','أسود · أبيض'],['orange · pink','برتقالي · وردي'],['It is blue.','لونه أزرق.']],tasks:[
{...choice('c1','Paint the sail red.','لوّن الشراع بالأحمر.','red',['red','blue','green','yellow']),type:'paint'},
{...choice('c2','Paint the sail blue.','لوّن الشراع بالأزرق.','blue',['green','pink','blue','white']),type:'paint'},
listen('c3','yellow','yellow',['green','yellow','orange']),
{...choice('c4','Paint the sail green.','لوّن الشراع بالأخضر.','green',['black','green','orange','pink']),type:'paint'},
choice('c5','What colour is the snow?','الثلج لونه إيه؟','white',['white','black','pink'],{scene:'snow'}),
listen('c6','orange','orange',['pink','red','orange']),
order('c7','Say that it is pink.','رتّب الجملة: لونه وردي.',['pink.','is','It'],'It is pink.'),
{...choice('c8','Paint the sail black.','لوّن الشراع بالأسود.','black',['white','pink','black','blue']),type:'paint'}]},
{id:'body',name:'مرصد الحركة',en:'Move and discover',icon:'☾',color:'#91c7e8',x:88,y:14,goal:'تتعرف على أجزاء الجسم وتفهم أوامر بسيطة.',vocab:[['head · hair','رأس · شعر'],['eye · ear · nose · mouth','عين · أذن · أنف · فم'],['hand · arm','يد · ذراع'],['leg · foot','رجل · قدم'],['Touch your head.','المس رأسك.']],tasks:[
{id:'b1',type:'body',prompt:'Touch the head.',ar:'اختار رأس الشخصية.',answer:'head'},
listen('b2','hand','hand',['foot','hand','eye']),
{id:'b3',type:'body',prompt:'Touch the foot.',ar:'اختار قدم الشخصية.',answer:'foot'},
choice('b4','Which body part do you use to hear?','بنسمع بأنهي جزء؟','ear',['eye','ear','nose']),
listen('b5','nose','nose',['mouth','hair','nose']),
order('b6','Ask your friend to touch their head.','رتّب الأمر. ممكن تقوله وتعمله من غير ميكروفون.',['head.','your','Touch'],'Touch your head.'),
choice('b7','Which word means ذراع?','اختار كلمة ذراع.','arm',['leg','arm','mouth']),
{id:'b8',type:'body',prompt:'Touch the hand.',ar:'اختار يد الشخصية.',answer:'hand'}]}
];
export const finale={id:'finale',name:'رحلة التاج',en:'The island challenge',icon:'♛',goal:'اربط اللي اتعلمته في رحلة واحدة.',vocab:[],tasks:[
choice('r1','A new friend arrives. Choose your greeting.','صديق جديد وصل. تحيّيه بإيه؟','Hello!',['Goodbye!','Hello!','I am six.']),
order('r2','Introduce Omar.','رتّب تعريف عمر بنفسه.',['Omar.','name','My','is'],'My name is Omar.'),
count('r3',6),listen('r4','nine','9',['8','9','10']),
choice('r5','Nora says: I am eight. How old is she?','نورا قالت: I am eight. عندها كام سنة؟','8',['6','8','10']),
choice('r6','Which word means أخت?','اختار كلمة أخت.','sister',['mother','sister','brother']),
listen('r7','grandfather','grandfather',['grandmother','father','grandfather']),
{...choice('r8','Paint the sail pink.','اقرأ المطلوب بالإنجليزي، ثم اختار لون الشراع.','pink',['blue','pink','white','red']),type:'paint'},
{id:'r9',type:'body',prompt:'Touch the head.',ar:'اقرأ المطلوب بالإنجليزي، ثم اختار المكان على الشخصية.',answer:'head'},
order('r10','Say goodbye to your friends.','رتّب كلمة الوداع.',['friends!','Goodbye,'],'Goodbye, friends!')
]};
export const reviewTasks=finale.tasks;
lessons[4].tasks=[...lessons[4].tasks,...reviewTasks.map(t=>({...t,review:true}))];
export const allLessons=lessons;
export const palette={red:'#e74f58',blue:'#3887dc',green:'#35945d',yellow:'#f4ca47',white:'#f7f6ed',black:'#242f45',orange:'#ee913d',pink:'#ed98b7'};
export function isCorrect(task,value){return String(value).trim()===String(task.answer).trim()}
