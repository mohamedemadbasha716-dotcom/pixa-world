import 'server-only';
// Original private curriculum draft. Not routed or published.
const choice=(id,prompt,ar,answer,options)=>({id,type:'choice',prompt,ar,answer,options});
const hear=(id,spoken,answer,options)=>({...choice(id,'Listen and choose.','اسمع، واختار الإجابة.',answer,options),spoken,listening:true});
const order=(id,ar,words,answer)=>({id,type:'order',prompt:'Put the words in order.',ar,words,answer});
const pet=(id,prompt,ar,answer,targets)=>({id,type:'scene',scene:'animals',prompt,ar,answer,targets});
const tray=(id,prompt,ar,answer,items)=>({id,type:'pack',prompt,ar,answer:answer.sort().join('|'),items,required:answer.length,container:'picnic'});
export const mapThree={id:'living-garden',name:'الحديقة الحيّة',en:'The Living Garden',description:'ساعد الأسد يرحّب بالحيوانات ويجهّز نزهة لأصحاب الحديقة.',lessons:[
{id:'garden-pets',name:'أصدقاء الحديقة',en:'Meet the pets',color:'#94cb9b',x:12,y:69,goal:'تتعرف على حيوانات أليفة وتصفها بكلمات من الخريطة الأولى.',vocab:[['cat','قطة'],['dog','كلب'],['fish','سمكة'],['bird','عصفور'],['rabbit','أرنب'],['It is a cat.','إنها قطة.']],tasks:[
pet('gp1','Find the rabbit.','اختار الأرنب اللي هيزور الحديقة.','rabbit',['cat','dog','rabbit','fish']),
hear('gp2','cat','cat',['cat','dog','fish']),
pet('gp3','Find the bird.','اختار العصفور.','bird',['rabbit','fish','bird','dog']),
order('gp4','رتّب الجملة: إنها قطة.',['cat.','a','It','is'],'It is a cat.'),
choice('gp5','The dog is brown. What colour is it?','كلب القصة بني. اختار لونه.','brown',['blue','brown','red']),
hear('gp6','fish','fish',['rabbit','fish','bird']),
pet('gp7','Find the dog.','اختار الكلب.','dog',['cat','dog','rabbit','bird']),
choice('gp8','Which sentence means هذا أرنب؟','اختار الجملة المناسبة للأرنب.','It is a rabbit.',['It is a fish.','It is a rabbit.','It is a book.'])]},
{id:'garden-wildlife',name:'رحلة الحيوانات',en:'Meet wild animals',color:'#ddbb6b',x:42,y:73,goal:'تتعرف على خمسة حيوانات وتستخدم big وsmall في قصة.',vocab:[['lion','أسد'],['elephant','فيل'],['monkey','قرد'],['giraffe','زرافة'],['zebra','حمار وحشي'],['big','كبير'],['small','صغير']],tasks:[
pet('gw1','Find the elephant.','اختار الفيل.','elephant',['lion','elephant','monkey','giraffe']),
hear('gw2','giraffe','giraffe',['zebra','giraffe','monkey']),
pet('gw3','Find the zebra.','اختار الحمار الوحشي.','zebra',['monkey','zebra','lion','elephant']),
choice('gw4','In the story, the elephant is big and the rabbit is small. Which animal is small?','في القصة: الفيل كبير والأرنب صغير. مين الصغير؟','rabbit',['elephant','rabbit','giraffe']),
order('gw5','رتّب الجملة: الأسد كبير.',['big.','lion','The','is'],'The lion is big.'),
hear('gw6','monkey','monkey',['lion','monkey','zebra']),
pet('gw7','Find the lion.','اختار الأسد، دليل الرحلة.','lion',['lion','elephant','giraffe','zebra']),
choice('gw8','Which word means صغير?','اختار الكلمة اللي معناها صغير.','small',['big','small','green'])]},
{id:'garden-actions',name:'مسرح أقدر أعمل',en:'I can do it',color:'#83c9d1',x:38,y:42,goal:'تفهم أفعال حركة بسيطة وتكوّن جملة باستخدام can.',vocab:[['run','يجري'],['jump','يقفز'],['swim','يسبح'],['fly','يطير'],['walk','يمشي'],['I can jump.','أستطيع القفز.'],['I cannot fly.','لا أستطيع الطيران.']],tasks:[
choice('ga1','A fish can swim. Choose the action.','سمكة القصة بتسبح. اختار الفعل.','swim',['swim','fly','run']),
hear('ga2','jump','jump',['walk','jump','swim']),
order('ga3','رتّب الجملة: أستطيع الجري.',['run.','can','I'],'I can run.'),
choice('ga4','The bird can fly. Which action can it do?','العصفور في القصة بيطير. اختار الفعل.','fly',['walk','fly','jump']),
hear('ga5','I can swim.','I can swim.',['I can run.','I can swim.','I cannot fly.']),
order('ga6','رتّب الجملة: لا أستطيع الطيران.',['fly.','I','cannot'],'I cannot fly.'),
choice('ga7','Can you jump? Choose the yes answer.','ده حوار خيالي. اختار رد الموافقة.','Yes, I can.',['Yes, I can.','No, I cannot.','I am seven.']),
choice('ga8','Which word means يمشي?','اختار معنى يمشي.','walk',['run','walk','swim'])]},
{id:'garden-picnic',name:'سلة النزهة',en:'Pack a picnic',color:'#e9a77a',x:67,y:34,goal:'تسمّي أطعمة وتفهم تفضيلًا في حوار خيالي.',vocab:[['apple','تفاحة'],['banana','موزة'],['orange','برتقالة'],['bread','خبز'],['cheese','جبن'],['rice','أرز'],['I like apples.','أحب التفاح.'],['I do not like rice.','لا أحب الأرز.']],tasks:[
tray('gf1','Pack the apple and the banana.','حط التفاحة والموزة في سلة النزهة.',['apple','banana'],['apple','banana','bread','rice']),
hear('gf2','cheese','cheese',['bread','cheese','orange']),
order('gf3','رتّب الجملة: أحب التفاح.',['apples.','I','like'],'I like apples.'),
choice('gf4','Omar says: I like rice. What food does he like?','عمر في القصة بيحب الأرز. اختار الأكل.','rice',['bread','rice','banana']),
tray('gf5','Pack the bread and the cheese.','حط الخبز والجبن في السلة.',['bread','cheese'],['bread','orange','cheese','rice']),
hear('gf6','orange','orange',['apple','banana','orange']),
order('gf7','رتّب الجملة: لا أحب الأرز.',['not','rice.','I','like','do'],'I do not like rice.'),
choice('gf8','Nora says: I do not like bananas. Does she like bananas?','في الحوار: نورا مش بتحب الموز. اختار الرد.','No, she does not.',['Yes, she does.','No, she does not.','Hello!'])]},
{id:'garden-cafe',name:'مقهى الأصدقاء',en:'A friendly garden cafe',color:'#bdabe5',x:87,y:15,goal:'تطلب مشروبًا بأدب وتراجع حيوانات وحركة وأكل.',vocab:[['water','ماء'],['milk','حليب'],['juice','عصير'],['Can I have water, please?','هل يمكن أن آخذ ماءً، من فضلك؟'],['Here you are.','اتفضل.'],['Thank you.','شكرًا.']],tasks:[
hear('gc1','water','water',['milk','water','juice']),
choice('gc2','Nora is asking politely for water. Choose her words.','اختار طلب ماء بأدب لشخصية القصة.','Can I have water, please?',['Can I have water, please?','I am water.','It is a chair.']),
order('gc3','رتّب الطلب: عصير، من فضلك.',['please.','Juice,'],'Juice, please.'),
hear('gc4','milk','milk',['juice','milk','water']),
choice('gc5','Omar gives Nora a drink. What can she say?','عمر قدّم المشروب لنورا. تختار تقول إيه؟','Thank you.',['Good night.','Thank you.','I am seven.']),
order('gc6','رتّب الرد: اتفضل.',['are.','Here','you'],'Here you are.'),
choice('gc7','Can I have juice, please? Choose a helpful reply.','اختار الرد المناسب لطلب العصير.','Here you are.',['Here you are.','I can jump.','It is big.']),
hear('gc8','Thank you.','Thank you.',['Goodbye!','Thank you.','Good morning.']),
pet('gr1','Find the rabbit.','اختار الأرنب.','rabbit',['cat','dog','rabbit','bird']),
hear('gr2','elephant','elephant',['lion','elephant','monkey']),
choice('gr3','The bird can fly. Choose fly.','اختار الفعل اللي في الجملة.','fly',['swim','fly','run']),
order('gr4','رتّب الجملة: أستطيع القفز.',['jump.','I','can'],'I can jump.'),
tray('gr5','Pack the orange and the bread.','حط البرتقالة والخبز في السلة.',['orange','bread'],['banana','orange','bread','rice']),
hear('gr6','juice','juice',['water','milk','juice']),
choice('gr7','Which word means كبير?','اختار معنى كبير.','big',['small','big','brown']),
order('gr8','رتّب الجملة: أحب التفاح.',['like','apples.','I'],'I like apples.'),
choice('gr9','Nora asks for water. Choose a polite request.','اختار طلب ماء بأدب.','Water, please.',['Water, please.','I can water.','This is fly.']),
choice('gr10','Your story friend gives you juice. Choose a kind reply.','صديقك في القصة قدّم لك العصير. اختار الرد المناسب.','Thank you.',['I cannot fly.','Thank you.','I am seven.'])].map((t,i)=>i>=8?{...t,review:true}:t)}]};
