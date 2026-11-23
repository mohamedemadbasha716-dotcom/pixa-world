import 'server-only';
// Original authored map2 content. Not routed or published yet.
const choose=(id,prompt,ar,answer,options,extra={})=>({id,type:'choice',prompt,ar,answer,options,...extra});
const hear=(id,spoken,answer,options)=>choose(id,'Listen and choose.','اسمع، واختار الإجابة.',answer,options,{spoken,listening:true});
const arrange=(id,ar,words,answer)=>({id,type:'order',prompt:'Put the words in order.',ar,words,answer});
const scene=(id,prompt,ar,answer,targets,kind)=>({id,type:'scene',prompt,ar,answer,targets,scene:kind});
export const mapTwo={id:'discovery-house',name:'بيت الاكتشافات',en:'The Discovery House',description:'ساعد الأسد يجهّز بيتًا ومدرسة لأصدقاء الجزيرة.',lessons:[
{id:'home-rooms',name:'مفاتيح البيت',en:'Rooms in the house',color:'#e9b251',x:29,y:66,goal:'تربط أسماء غرف البيت باستخدامها في قصة واضحة.',vocab:[['house','بيت'],['bedroom','غرفة نوم'],['kitchen','مطبخ'],['bathroom','حمّام'],['living room','غرفة معيشة'],['This is the kitchen.','هذا المطبخ.']],tasks:[
scene('hr1','Find the kitchen.','اختار المطبخ في بيت الأسد.','kitchen',['bedroom','kitchen','bathroom','living room'],'rooms'),
hear('hr2','bedroom','bedroom',['bedroom','bathroom','kitchen']),
scene('hr3','Find the bathroom.','اختار الحمّام في البيت.','bathroom',['bedroom','kitchen','bathroom','living room'],'rooms'),
arrange('hr4','رتّب الجملة: هذا المطبخ.',['kitchen.','This','the','is'],'This is the kitchen.'),
choose('hr5','Nora cooks in the kitchen. Which room does she need?','في القصة، نورا بتطبخ في المطبخ. اختار الغرفة.','kitchen',['living room','kitchen','bedroom']),
hear('hr6','living room','living room',['bathroom','living room','bedroom']),
scene('hr7','Find the bedroom.','اختار غرفة النوم.','bedroom',['bedroom','kitchen','bathroom','living room'],'rooms'),
choose('hr8','Which word means بيت?','اختار الكلمة اللي معناها بيت.','house',['family','house','head'])]},
{id:'home-furniture',name:'ورشة الأثاث',en:'Furniture for our friends',color:'#edbd68',x:55,y:73,goal:'تسمّي أثاثًا أساسيًا وتجهّز غرفة خيالية.',vocab:[['bed','سرير'],['chair','كرسي'],['table','طاولة'],['sofa','أريكة'],['door','باب'],['window','نافذة'],['This is a chair.','هذا كرسي.']],tasks:[
scene('hf1','Find the chair.','الأسد محتاج كرسي. اختاره.','chair',['bed','chair','table','sofa','door','window'],'furniture'),
hear('hf2','table','table',['bed','table','window']),
scene('hf3','Find the bed.','اختار السرير.','bed',['bed','chair','table','sofa','door','window'],'furniture'),
arrange('hf4','رتّب الجملة: هذا كرسي.',['a','chair.','This','is'],'This is a chair.'),
hear('hf5','window','window',['door','chair','window']),
scene('hf6','Find the door.','اختار الباب.','door',['bed','chair','table','sofa','door','window'],'furniture'),
choose('hf7','Which word means أريكة?','هنقعد نقرا قصة على الأريكة. اسمها إيه؟','sofa',['table','sofa','window']),
choose('hf8','Omar says: This is a bed. What is he showing?','عمر قال: This is a bed. اختار معنى bed.','سرير',['كرسي','سرير','باب'])]},
{id:'school-tools',name:'حقيبة المستكشف',en:'Pack the school bag',color:'#e7a876',x:49,y:36,goal:'تتعرف على أدوات المدرسة وتختار المطلوب للحقيبة.',vocab:[['bag','حقيبة'],['book','كتاب'],['pencil','قلم رصاص'],['pen','قلم'],['ruler','مسطرة'],['eraser','ممحاة'],['I have got a book.','معي كتاب.']],tasks:[
{id:'st1',type:'pack',prompt:'Pack the book and the pencil.',ar:'حط الكتاب وقلم الرصاص في الحقيبة.',answer:'book|pencil',items:['book','pencil','ruler','eraser'],required:2},
hear('st2','ruler','ruler',['pencil','ruler','eraser']),
choose('st3','Which word means ممحاة?','لو عايز تمسح خط قلم الرصاص، تختار إيه؟','eraser',['book','eraser','bag']),
arrange('st4','رتّب الجملة: معي كتاب.',['got','book.','I','a','have'],'I have got a book.'),
{id:'st5',type:'pack',prompt:'Pack the ruler and the eraser.',ar:'حط المسطرة والممحاة في الحقيبة.',answer:'eraser|ruler',items:['pen','ruler','book','eraser'],required:2},
hear('st6','pen','pen',['pen','bag','book']),
choose('st7','Nora has got a blue bag. What colour is her bag?','نورا معاها حقيبة زرقاء. لونها إيه؟','blue',['red','blue','green']),
choose('st8','Have you got a book? Choose a yes answer.','اختار الرد اللي معناه: أيوه، معايا.','Yes, I have.',['No, I have not.','Yes, I have.','Goodbye!'])]},
{id:'positions',name:'لعبة مكانه فين',en:'Where is the ball?',color:'#bba2f4',x:78,y:39,goal:'تفهم in وon وunder من مشهد واضح.',vocab:[['ball','كرة'],['box','صندوق'],['in','داخل'],['on','على'],['under','تحت'],['Where is the ball?','أين الكرة؟'],['It is under the table.','إنها تحت الطاولة.']],tasks:[
{id:'po1',type:'place',prompt:'Put the ball in the box.',ar:'حط الكرة داخل الصندوق.',answer:'in',object:'ball',reference:'box',options:['in','on','under']},
hear('po2','under','under',['on','in','under']),
{id:'po3',type:'place',prompt:'Put the ball on the box.',ar:'حط الكرة على الصندوق.',answer:'on',object:'ball',reference:'box',options:['in','on','under']},
arrange('po4','رتّب السؤال: الكرة فين؟',['ball?','is','Where','the'],'Where is the ball?'),
{id:'po5',type:'place',prompt:'Put the ball under the box.',ar:'حط الكرة تحت الصندوق.',answer:'under',object:'ball',reference:'box',options:['in','on','under']},
hear('po6','in','in',['under','on','in']),
arrange('po7','رتّب الجملة: إنها تحت الطاولة.',['the','under','It','table.','is'],'It is under the table.'),
choose('po8','The ball is in the bag. Where is the ball?','الكرة داخل الحقيبة. اختار معنى in.','داخل',['على','داخل','تحت'])]},
{id:'classroom-mission',name:'يوم المدرسة',en:'Ready for class',color:'#91c7e8',x:89,y:14,goal:'تفهم أوامر فصل بسيطة وتراجع البيت والمدرسة.',vocab:[['teacher','معلّم أو معلّمة'],['school','مدرسة'],['classroom','فصل'],['Open your book.','افتح كتابك.'],['Close your book.','اقفل كتابك.'],['Listen, please.','اسمع، من فضلك.']],tasks:[
choose('cm1','Nora is going to school. Who teaches the class?','في القصة، مين بيعلّم الفصل؟','teacher',['baby','teacher','chair']),
hear('cm2','Open your book.','افتح الكتاب',['اقفل الكتاب','افتح الكتاب','جهّز الحقيبة']),
arrange('cm3','رتّب الأمر: افتح كتابك.',['book.','Open','your'],'Open your book.'),
{id:'cm4',type:'book',prompt:'Close your book.',ar:'الكتاب مفتوح. اقفله، وبعدين أكّد اختيارك.',answer:'close',options:['open','close']},
hear('cm5','Listen, please.','Listen, please.',['Goodbye!','Listen, please.','I am seven.']),
arrange('cm6','رتّب الأمر: اقفل كتابك.',['your','book.','Close'],'Close your book.'),
choose('cm7','Which word means فصل?','اختار الكلمة اللي معناها فصل دراسي.','classroom',['bathroom','classroom','bedroom']),
choose('cm8','Omar needs a pencil. Choose a helpful reply.','عمر محتاج قلم رصاص. اختار رد يساعده.','Here you are.',['Good night.','Here you are.','I am seven.']),
hear('mr21','kitchen','kitchen',['bedroom','kitchen','bathroom']),
scene('mr22','Find the sofa.','اختار الأريكة.','sofa',['bed','chair','table','sofa','door','window'],'furniture'),
{id:'mr23',type:'pack',prompt:'Pack the book and the ruler.',ar:'حط الكتاب والمسطرة في الحقيبة.',answer:'book|ruler',items:['book','ruler','pen','eraser'],required:2},
{id:'mr24',type:'place',prompt:'Put the ball under the box.',ar:'اختار المكان المناسب للكرة.',answer:'under',object:'ball',reference:'box',options:['in','on','under']},
arrange('mr25','رتّب الأمر المناسب: افتح الكتاب.',['your','Open','book.'],'Open your book.'),
hear('mr26','bedroom','bedroom',['living room','bedroom','bathroom']),
choose('mr27','Which word means نافذة?','اختار معنى نافذة.','window',['window','door','table']),
hear('mr28','eraser','eraser',['book','eraser','pencil']),
arrange('mr29','رتّب الجملة: معي كتاب.',['a','have','I','book.','got'],'I have got a book.'),
choose('mr30','The ball is on the table. Which word means على?','اختار الكلمة اللي معناها على.','on',['in','under','on'])].map((t,i)=>i>=8?{...t,review:true}:t)}]};
export const mapTwoLessons=mapTwo.lessons;
