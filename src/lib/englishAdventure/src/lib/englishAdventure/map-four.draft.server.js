import 'server-only';
// Private original curriculum draft. Scene/clock/route games require integration.
const c=(id,prompt,ar,answer,options)=>({id,type:'choice',prompt,ar,answer,options});
const h=(id,spoken,answer,options)=>({...c(id,'Listen and choose.','اسمع، واختار.',answer,options),spoken,listening:true});
const o=(id,ar,words,answer)=>({id,type:'order',prompt:'Put the words in order.',ar,words,answer});
const scene=(id,prompt,ar,answer,targets,kind)=>({id,type:'scene',prompt,ar,answer,targets,scene:kind});
const clock=(id,hour)=>({id,type:'clock',prompt:`Set the clock to ${['twelve','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'][hour]} o'clock.`,ar:'حرّك عقرب الساعات للوقت المطلوب، وعقرب الدقايق على ١٢.',answer:String(hour),hour});
export const mapFour={id:'town-journeys',name:'مدينة الرحلات',en:'The Journey Town',description:'خطط رحلة خيالية في مدينة الأسد، وجهّز اللبس والوقت المناسبين.',lessons:[
{id:'town-places',name:'دليل المدينة',en:'Places to explore',color:'#76bbd4',x:15,y:70,goal:'تسمّي أماكن في المدينة وتختار مكانًا لهدف واضح.',vocab:[['park','حديقة'],['shop','محل'],['school','مدرسة'],['library','مكتبة'],['hospital','مستشفى'],['Where is the park?','أين الحديقة؟']],tasks:[
scene('tp1','Find the library.','نورا عايزة تستعير كتاب. اختار المكتبة.','library',['park','shop','school','library','hospital'],'town'),
h('tp2','park','park',['shop','park','school']),
c('tp3','Omar wants to buy an apple. Where can he go?','في القصة، المحل بيبيع فاكهة. عمر يروح فين؟','shop',['library','shop','park']),
o('tp4','رتّب السؤال: الحديقة فين؟',['park?','Where','the','is'],'Where is the park?'),
scene('tp5','Find the school.','اختار المدرسة على خريطة المدينة.','school',['park','shop','school','library','hospital'],'town'),
h('tp6','hospital','hospital',['school','hospital','shop']),
c('tp7','Which place has story books to borrow?','اختار المكان اللي بنستعير منه كتب.','library',['park','library','shop']),
c('tp8','Which word means حديقة?','اختار معنى حديقة.','park',['shop','park','hospital'])]},
{id:'town-transport',name:'محطة الانطلاق',en:'Choose a ride',color:'#d6b875',x:44,y:72,goal:'تتعرف على وسائل نقل وتفهم وصف رحلة خيالية.',vocab:[['bus','أتوبيس'],['car','سيارة'],['train','قطار'],['bike','دراجة'],['boat','قارب'],['I go by bus.','أذهب بالأتوبيس.']],tasks:[
scene('tt1','Find the boat.','رحلة نورا في المية. اختار القارب.','boat',['bus','car','train','bike','boat'],'transport'),
h('tt2','train','train',['bike','train','car']),
o('tt3','رتّب الجملة: أذهب بالأتوبيس.',['bus.','go','I','by'],'I go by bus.'),
c('tt4','Omar goes by bike. Choose his transport.','عمر في القصة راكب دراجة. اختار وسيلته.','bike',['car','bike','boat']),
scene('tt5','Find the car.','اختار السيارة.','car',['bus','car','train','bike','boat'],'transport'),
h('tt6','bus','bus',['boat','bus','train']),
c('tt7','Nora is on a boat. Where is her boat in this story?','قارب نورا في النهر. اختار المكان.','on the water',['on the water','in the classroom','under the bed']),
c('tt8','Which word means قطار?','اختار معنى قطار.','train',['car','train','bike'])]},
{id:'town-clothes',name:'ورشة الرحّالة',en:'Dress for the story',color:'#d5a1c7',x:47,y:39,goal:'تسمّي ملابس وتجهّز شخصية خيالية حسب طلبها.',vocab:[['hat','قبعة'],['shirt','قميص'],['trousers','بنطلون'],['shoes','حذاء'],['coat','معطف'],['I am wearing a hat.','أنا أرتدي قبعة.']],tasks:[
{id:'tc1',type:'dress',prompt:'Give the explorer a hat.',ar:'اختار القبعة للشخصية الخيالية.',answer:'hat',items:['hat','shirt','coat','shoes']},
h('tc2','shoes','shoes',['hat','shoes','shirt']),
o('tc3','رتّب الجملة: أنا أرتدي قبعة.',['hat.','am','a','I','wearing'],'I am wearing a hat.'),
c('tc4','Nora is wearing a red shirt. What colour is her shirt?','قميص نورا في القصة أحمر. اختار لونه.','red',['blue','red','green']),
{id:'tc5',type:'dress',prompt:'Give the explorer a coat.',ar:'الشخصية طلبت معطف. اختاره.',answer:'coat',items:['hat','trousers','coat','shirt']},
h('tc6','trousers','trousers',['shirt','trousers','shoes']),
c('tc7','Which word means قميص?','اختار معنى قميص.','shirt',['hat','shirt','coat']),
c('tc8','Omar has got blue shoes. Which item is blue?','عمر معاه حذاء أزرق. أي حاجة زرقاء؟','shoes',['hat','coat','shoes'])]},
{id:'town-weather',name:'مرصد الجو',en:'Look at the weather',color:'#8cbcd8',x:70,y:28,goal:'تتعرف على حالة الجو من مشهد وتوصفها بجملة.',vocab:[['sunny','مشمس'],['rainy','ممطر'],['windy','به رياح'],['cloudy','غائم'],['hot','حار'],['cold','بارد'],['It is sunny.','الجو مشمس.']],tasks:[
scene('tw1','Find the rainy scene.','اختار مشهد المطر.','rainy',['sunny','rainy','windy','cloudy'],'weather'),
h('tw2','windy','windy',['sunny','windy','cold']),
o('tw3','رتّب الجملة: الجو مشمس.',['sunny.','is','It'],'It is sunny.'),
c('tw4','In the story, it is cold. Nora asks for her coat. What does she want?','الجو بارد في القصة، ونورا طلبت المعطف. عايزة إيه؟','coat',['coat','book','ruler']),
scene('tw5','Find the cloudy scene.','اختار السماء المليانة سحاب.','cloudy',['sunny','rainy','windy','cloudy'],'weather'),
h('tw6','hot','hot',['cold','hot','rainy']),
c('tw7','Which word is the opposite of hot?','اختار عكس حار.','cold',['cold','sunny','windy']),
c('tw8','The sky is sunny in the picture story. Choose the sentence.','اختار جملة: الجو مشمس.','It is sunny.',['It is rainy.','It is sunny.','It is a bus.'])]},
{id:'town-clock',name:'موعد الرحلة',en:'Time to go',color:'#cfb486',x:88,y:13,goal:'تقرأ الساعة الكاملة وتراجع رحلة المدينة.',vocab:[['eleven','أحد عشر'],['twelve','اثنا عشر'],["What time is it?",'كم الساعة؟'],["It is three o'clock.",'الساعة الثالثة.'],["It is eight o'clock.",'الساعة الثامنة.']],tasks:[
clock('tk1',3),h('tk2','eleven','11',['10','11','12']),
o('tk3','رتّب السؤال: الساعة كام؟',['it?','time','What','is'],'What time is it?'),
clock('tk4',8),h('tk5','twelve','12',['10','11','12']),
c('tk6',"It is three o'clock. Choose the hour.",'اختار رقم الساعة الثالثة.','3',['2','3','8']),
clock('tk7',12),o('tk8','رتّب الجملة: الساعة الثامنة.',['eight',"o'clock.",'It','is'],"It is eight o'clock."),
scene('tr1','Find the library.','اختار المكتبة.','library',['park','shop','school','library','hospital'],'town'),
h('tr2','boat','boat',['bus','boat','bike']),
{id:'tr3',type:'dress',prompt:'Give the explorer shoes.',ar:'اختار الحذاء للشخصية.',answer:'shoes',items:['hat','shirt','coat','shoes']},
scene('tr4','Find the windy scene.','اختار مشهد الرياح.','windy',['sunny','rainy','windy','cloudy'],'weather'),
clock('tr5',11),o('tr6','رتّب الجملة: أذهب بالأتوبيس.',['by','I','bus.','go'],'I go by bus.'),
h('tr7','coat','coat',['hat','coat','shoes']),
c('tr8','Which word means بارد?','اختار معنى بارد.','cold',['hot','cold','cloudy']),
c('tr9','Nora wants a story book. Where can she borrow one?','نورا عايزة تستعير كتاب قصة. تروح فين؟','library',['shop','park','library']),
c('tr10','Omar says: Thank you. Choose a friendly reply.','اختار الرد المناسب لشكر عمر.','You are welcome.',['You are welcome.','I am a bus.','It is cold.'])].map((t,i)=>i>=8?{...t,review:true}:t)}]};
