/* Local, rule-based verse composition. These are edited modern pastiches,
 * not quotations attributed to historical poets and not a trained model.
 * Vocabulary references: 唐诗三百首 / 宋词三百首 (public-domain originals).
 */
(function(root){
 const sources=[
  {title:'唐诗三百首',url:'https://zh.wikisource.org/wiki/唐詩三百首'},
  {title:'宋词三百首',url:'https://zh.wikisource.org/zh-hans/宋詞三百首'},
  {title:'定风波·莫听穿林打叶声',author:'苏轼',url:'https://zh.wikisource.org/zh-hans/定風波_(莫聽穿林打葉聲)'}
 ];
 const split=s=>s.trim().split(/\s+/u).filter(Boolean);
 const themes=[
  {id:'spring',keywords:'春花风柳芳新绿燕晴',lines:split(`
春水初生绕短墙 春风吹暖旧池塘 春山雨后杏花香 春光一院入晴窗
风过疏帘花影动 风来小径草生香 花开陌上人初见 花落茶瓯水亦香
好雨轻敲竹外窗 好风吹绿柳丝长 月上花枝春未老 月移花影到东墙
有客携琴寻野渡 有人踏露过横塘 信里春山青欲滴 信笺犹带落梅香
安坐小亭听燕语 平桥烟柳接斜阳 喜见归来双燕子 乐听新雨打回廊
生机已向枝头见 活水一渠绕竹房 云开远岫晴光满 山色微青入草堂
雨歇小园苔色润 雨余花气上衣裳 清溪带雨穿林去 明日相携看海棠
晓色初分花外路 远村烟起杏花旁 日暖游丝牵客袖 人归竹院试新茶`)},
  {id:'landscape',keywords:'山河海云水竹清林石泉',lines:split(`
山色遥随流水去 山中一夜雨生凉 山外疏钟传古寺 山前白鹭下横塘
河声入夜来窗下 河岸微风动晚芦 海阔天青孤帆远 海潮初落见沙洲
云影不随流水去 云深偶见采茶人 水抱青山山抱月 水声穿竹到柴门
清泉漱石松阴静 清风吹散一溪云 林深不觉人声远 林外斜阳照钓舟
石上苔痕经雨绿 石桥流水绕山村 竹径无人花自落 竹窗有月夜生凉
陈迹苔封山寺路 佳境犹藏竹树间 磊石临溪分远翠 园中松影过疏窗
一叶轻舟穿野渡 一川烟雨入平湖 长堤柳色连天远 长空雁影落寒汀
远岫雨余青似染 远山日暮鸟知还 江上风来吹短笛 江边月出照归舟
白云来去青山外 白鹭闲眠浅水洲 平湖照影天无际 安向松间听晚钟`)},
  {id:'affection',keywords:'爱恋想念喜欢你情心见相知',lines:split(`
我寄相思随雁去 我留灯火待君归 你来小院花先觉 你过长桥月正圆
爱意犹藏眉眼里 爱将春色寄君前 想见归舟穿柳岸 想听旧曲到更阑
念远无声灯影里 念君有信雁行边 喜逢小径花初放 喜见青衫过短桥
欢言未尽茶犹暖 欢声犹在小楼间 相看不语春灯暖 相逢一笑故人来
见月遥知君未睡 见君先觉晚风柔 心事轻书红叶上 心灯长照远人归
情随流水经千里 情入春笺字字深 君来恰是梅开日 君去犹留月满窗
佳期未到花先放 佳人倚竹待新晴 久别重逢茶尚热 长夜相思月未眠
愿把春山分一半 愿同明月照君还 明月随人千里共 清风寄信一江遥
好景与君同入画 花笺一纸寄平安 有约不辞千里路 信来犹带故人温`)},
  {id:'home',keywords:'家归团圆花好月圆团聚安',lines:split(`
花开小院迎归客 花影临窗入夜深 好风吹暖归人袖 好月长随故里云
月照柴门人未寝 月移竹影过东窗 圆月临窗茶正暖 圆灯照夜待人归
家山入梦随云近 家书到手带春温 归舟已过三千水 归客重逢一盏灯
团坐灯前听旧事 团圆此夜月初升 平安二字书千遍 平生最念故乡人
安坐小窗茶尚暖 安眠此夜雨无声 清茶未冷人先到 明月初来夜不寒
你归小院花犹在 我待柴门月已深 一盏新茶温旧话 一庭灯火待归人
远路行人知夜暖 远山归鸟识巢温 信中未说乡愁事 信到灯前字字亲
欢言未尽灯犹亮 喜见庭前旧燕归 生涯有味家常饭 活水清茶伴故人
山河入梦乡音近 河畔新灯照故园 无事闲看窗外月 恙消人共一庭春`)},
  {id:'blessing',keywords:'生日快乐祝福平安喜乐顺吉健康万事',lines:split(`
生逢好景花初放 生来心事向晴空 日暖庭前花有信 日长窗下竹无尘
快意且听松外雨 快舟稳过水云乡 乐与故人同把盏 乐将闲日付书香
平湖无浪轻舟稳 平生有愿岁常新 安将心事交明月 安坐庭前看白云
喜见新枝添翠色 喜逢良夜月初圆 福随灯火临门暖 福与春风到院深
康宁常伴门前柳 健步徐行竹外山 万里归来身自在 万般心事付清风
事随流水终成序 事到心宽自有春 顺水轻舟随岸转 顺风归雁入云深
意在闲庭听细雨 意随明月到天涯 吉日新茶迎远客 祥光一院照新枝
年年花好人长健 岁岁灯明夜自温 长与亲朋同笑语 久留清气在心间
愿君行处皆晴日 愿把新诗祝岁安 有梦不妨随月去 无愁且共一杯茶
好日轻翻书一卷 春来又见柳千条 心宽自觉天地阔 新岁平安入酒杯`)},
  {id:'journey',keywords:'远行路旅天涯梦志前程',lines:split(`
长风吹送千帆去 长路随云过远山 远水连天归雁小 远帆带雨入江湾
行过青山知路远 行随明月到天涯 路转溪桥山忽近 路逢野店酒初温
一蓑细雨穿林去 一棹轻舟逐水行 天涯有信云中寄 天外青山雨后明
梦随归雁穿云去 梦逐春潮到海边 志在青山云外路 志随沧海日边帆
前路花开人未老 前山雨过草初青 程途有伴风吹暖 程路逢春柳色新
山重路转逢新客 河阔帆轻见远洲 云散长空星渐出 海边日出照征衣
张帆欲过千重浪 陈酒重斟送远人 佳期待向归时约 磊落胸怀任远游
许把平生交远路 愿携明月过长亭 清风不问来时路 明月相随万里行
无惧风波舟自稳 有人灯下候归帆 归来犹带山川色 回首青山已是春
晨起推窗看远岫 晚来系缆听江潮`) }
 ];
 /* Two-character openings carry syntax. Nouns, intentions, states and people
  * use different five-character continuations rather than one universal tail.
  */
 const lexicon={};
 function add(kind,text){for(const token of split(text)){const key=Array.from(token)[0];(lexicon[key]??=[]).push({text:token,kind})}}
 add('image',`春风 春山 春水 花影 花枝 花香 月色 月华 风声 风雨 山色 山泉 河声 海潮 云影 云帆 水声 水光 竹影 竹香 清风 清溪 林影 林泉 石径 石桥 松影 松风 梅香 梅影 兰香 荷香 柳色 柳烟 雪影 雨声 星光 日色 晓色 晚照 晨光 夜色 江潮 湖光 溪声 泉声 波光 岚光 烟柳 烟波 霞光 露华 霜华 叶影 枝影 桃花 杏花 莲香 桂香 菊影 草色 苔痕 木香 杉影 杨柳 杨花 梧桐 桐阴 柏影 白云 白鹭 青山 青溪 碧水 碧空 红梅 红叶 绿柳 黄花 黄昏 紫藤 朱栏 丹霞 秋月 冬雪 夏雨 东风 南山 西窗 北雁 新月 新柳 旧梦 旧雨 小楼 小径 远山 远帆 长风 长堤 高山 高柳 深林 微雨 轻舟 疏钟 疏雨 静水 明月 温风 柔风 寒泉 暖日 金风 玉露 银汉 锦帆 琼枝 琴声 书声 诗笺 文心 墨香 茶烟 酒香 灯火 窗影 庭花 院柳 园花 园竹 桥影 舟影 帆影 帘影 亭月 汀芦 渡水 湾月 岸柳 崖松 岩泉 谷风 城月 故园 家山 乡音 门柳 径草 塘月 浦云 沙洲 岭云 峰影 宇内 陈酿 陈酒 刘郎 孙枝 袁柳 罗衣 吴山 沈园 吕梁 魏阙 曹溪 钱塘 叶影 田园 杜鹃 苏堤 唐风 彭城 萧风 李花 王孙 张帆 梁燕 周舟 何山 江月 曾梦 韩江 朱楼 黄柳 胡笳 罗绮 郭柳 郭门 郑园 梁月 梁园 马蹄 林泉 孙竹 徐柳 邓竹 高楼 秦月 余霞 邱竹 侯月 邵柳 孟春 汪波 石泉 姚花 卢月 董柳 潘水 崔柳 陆帆 汤月 方舟 韦雨 夏荷 廖月 卓梅 卷帘 奶香 糕香`);
 add('feeling',`爱意 爱心 情意 情怀 心事 心愿 相思 相忆 想念 念想 恋意 我心 你心 君心 佳期 好梦 甜梦 梦想 知心 真心 诚意 意愿 信念 思念 欢心 乐意 宁愿 忆念`);
 add('person',`我来 我归 你来 你归 君来 君归 人来 人归 客来 客归 友来 友归 见君 见客 子来 子归 生来 归来 相逢 久别 张郎 王郎 李郎 刘郎 陈郎 杨郎 赵郎 黄郎 周郎 吴郎 徐郎 孙郎 朱郎 高郎 林郎 何郎 郭郎 马郎 罗郎 梁郎 宋郎 郑郎 谢郎 韩郎 唐郎 冯郎 于郎 董郎 萧郎 程郎 曹郎 袁郎 邓郎 许郎 傅郎 沈郎 曾郎 彭郎 吕郎 苏郎 卢郎 蒋郎 蔡郎 贾郎 丁郎 魏郎 薛郎 叶郎 阎郎 余郎 潘郎 杜郎 戴郎 夏郎 钟郎 汪郎 田郎 任郎 姜郎 范郎 方郎 石郎 姚郎 谭郎 廖郎 邹郎 熊郎 金郎 陆郎 郝郎 孔郎 白郎 崔郎 康郎 毛郎 邱郎 秦郎 江郎 史郎 顾郎 侯郎 邵郎 孟郎 龙郎 万郎 段郎 雷郎 钱郎 武郎`);
 add('intent',`愿携 愿将 想携 想将 念将 爱携 爱将 好将 乐将 喜携 欲携 欲将 且携 且将 只将 会携 许将 若将 若携 可携 能将 莫将 勿将 肯携 留将`);
 add('state',`平生 安然 安闲 快乐 快意  顺心 顺意 康宁 健行 吉祥 祥和 福来 磊落 坦然 悠然 依然 永怀 恬然 从容 自在 宁心 泰然 万事 事成 活水 生日 圆月 团圆 如愿 无愁 有幸 知足 晴日 美景 良辰 庆日 芳辰 佳日 嘉日 和暖 逸兴 俊赏 瑞日 华年 鸿愿 浩气 轩昂 朗然 睿思 敏思 慧心 颖悟 勤学 尧心 舜意 瑾心 瑜光 凯歌 达意 恙消 宙静`);
 const tails={
 spring:{
 image:split('初满小池塘 轻入旧轩窗 长伴一庭芳 犹带落花香 静落小桥旁 初映柳丝长 随客到横塘 来去杏花旁'),
 feeling:split('轻随燕子来 犹在杏花旁 欲寄小桥东 初向柳边生 长伴一年春 已逐落花飞'),
 person:split('恰值杏花开 共看燕子归 携酒过横塘 踏露看新枝 恰遇柳初青 笑指小桃红'),
 intent:split('春色入新诗 花信寄归人 新柳付春笺 芳草赠行人 花影入晴窗 燕语付新弦'),
 state:split('看尽一庭春 犹伴落花香 常在柳边生 恰逢燕子归 不负小园芳 又见杏花开')},
 landscape:{
 image:split('犹在画图中 长入故人诗 相映水云间 轻落小桥边 来去石溪旁 横过古桥西 静对碧山巅 长伴白云归'),
 feeling:split('长寄水云间 不改旧山青 犹在竹窗前 静落小溪旁 长向白云边 欲与水声和'),
 person:split('坐看白云飞 共听石上泉 携琴到水边 闲步竹林间 偶遇采茶人 静坐听松风'),
 intent:split('山色入新诗 泉声付素琴 云影寄闲心 竹韵入清弦 松月赠归人 远岫入画图'),
 state:split('自有水云心 常共白云闲 静听竹外泉 不负旧山青 长与碧山亲 闲看一溪云')},
 affection:{
 image:split('犹待故人归 长照小窗前 轻落旧书边 相伴两心知 犹带故人温 静入旧诗笺 长寄远人思 来去小楼间'),
 feeling:split('犹待故人归 长寄一笺中 轻向眼波生 不与岁时迁 欲寄雁行边 长在小楼前'),
 person:split('携月到窗前 共剪小窗灯 笑问旧时花 久坐话当年 相看夜未阑 恰在月圆时'),
 intent:split('心事寄君前 明月赠归人 尺素付归鸿 相思入短笺 灯火待君归 花信寄君知'),
 state:split('长伴故人归 不改旧时心 同看一窗月 共话小楼春 犹记旧时约 长盼雁书来')},
 home:{
 image:split('犹在故园中 长照旧庭前 轻入小窗间 犹带故人温 长伴一灯明 静对旧柴门 来去小楼间 相映一庭春'),
 feeling:split('犹在旧柴门 长寄故园中 随客到家门 轻落小窗前 长伴一灯明 不改故乡音'),
 person:split('坐对一灯温 共饮故园茶 携月到家门 笑说旧时春 重看院中花 共话一窗灯'),
 intent:split('灯火待归人 新酿贺团圆 尺素报平安 月色入庭前 旧话付清茶 灯影照归舟'),
 state:split('犹伴一灯温 常忆故园春 同坐小窗前 共饮一杯茶 自有故乡音 长与旧人亲')},
 blessing:{
 image:split('常伴岁时新 长照一庭春 犹带四时温 来去小楼春 长伴好时辰 静对一窗晴 轻入好年华 犹在笑声中'),
 feeling:split('常伴岁时新 犹在笑声中 长寄好年华 不负旧时心 长与月相亲 犹盼好时辰'),
 person:split('共饮一杯春 笑看岁时新 携酒贺芳辰 常伴好年华 坐看万家灯 共祝岁长安'),
 intent:split('新酒祝平安 好梦付春风 明月照前程 心愿寄星辰 闲日付书香 良夜赠亲朋'),
 state:split('常伴岁时新 长有好年华 不负少年心 自有四时春 共祝岁长安 常在笑声中')},
 journey:{
 image:split('相伴远人行 长入水云乡 犹在海天间 来去白云边 长向故园归 轻过万重山 犹带旧乡音 长照远人衣'),
 feeling:split('长向远山行 犹寄雁书中 不改少年心 长与白云亲 随梦到天涯 仍向故园归'),
 person:split('携月过长亭 笑指远山青 振袖向天涯 共看海日生 重过旧溪桥 归说远山云'),
 intent:split('明月照前程 长笛付江风 归信寄家山 云色入行囊 海日赠征帆 心事付长风'),
 state:split('不改少年心 常向远山行 自有水云心 无惧万重山 长与白云亲 归看旧园春')}
 };
 // For characters lacking an idiomatic opening, write about the actual name
 // on a letter. Never invent an ungrammatical surname compound.
 const nameTails={
 spring:split('题笺寄春风 写入杏花笺 留笺待燕归 题诗记柳青 写在花枝旁 题笺赠春山'),
 landscape:split('题诗寄远山 留笺伴水声 写入白云笺 题于竹外亭 留名石上泉 写在山水间'),
 affection:split('题笺寄故人 写入相思笺 留笺待君归 题诗赠知音 写在小窗前 留名月下笺'),
 home:split('题笺报平安 写入故园笺 留笺待客归 题诗寄家山 写在灯影间 留名旧窗前'),
 blessing:split('题笺祝岁安 写入贺年笺 留笺寄心愿 题诗赠芳辰 写在新岁前 留名好梦间'),
 journey:split('题笺寄远帆 写入远游笺 留笺报归期 题诗记远山 写在云水间 留名万里程')
 };
 const bank=themes.flatMap(theme=>theme.lines.map(text=>({text,theme:theme.id})));
 const starts=new Map();
 for(const line of bank){const key=Array.from(line.text)[0];if(!starts.has(key))starts.set(key,[]);starts.get(key).push(line)}
 function hash(text){let n=2166136261;for(const c of text)n=Math.imul(n^c.codePointAt(0),16777619);return n>>>0}
 function random(seed){return ()=>{seed+=0x6D2B79F5;let t=seed;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
 function chooseTheme(head,variant){
  const scored=themes.map(theme=>({theme,score:Array.from(head).reduce((n,c)=>n+(theme.keywords.includes(c)?1:0),0)}));
  const top=Math.max(...scored.map(x=>x.score));
  const choices=top?scored.filter(x=>x.score===top).map(x=>x.theme):themes;
  return choices[(hash(head)+Math.floor(variant/4))%choices.length];
 }
 const scentTails={
 spring:split('初满小轩窗 犹带落花香 轻入旧衣裳 长留竹院中'),
 landscape:split('犹在竹窗前 轻满小亭中 长伴一溪云 留客坐松阴'),
 affection:split('犹带故人温 轻满旧衣裳 长留小院中 留客到更深'),
 home:split('犹在故园中 轻满旧轩窗 留客坐灯前 长伴一灯温'),
 blessing:split('长伴好年华 犹带四时温 留客饮新春 轻满贺年杯'),
 journey:split('犹带旧乡音 轻满客衣襟 留客话归期 长伴远人行')
 };
 function candidates(char,theme){
  const result=(starts.get(char)||[]).filter(x=>x.theme===theme.id).map(x=>x.text);
  for(const opening of lexicon[char]||[]){for(const tail of /香|酿|酒/.test(opening.text)?scentTails[theme.id]:tails[theme.id][opening.kind])result.push(opening.text+tail)}
  if(!result.length)for(const tail of nameTails[theme.id]){result.push(char+'字'+tail);result.push(char+'名'+tail)};
  return [...new Set(result)].filter(line=>Array.from(line).length===7);
 }
 function generate(head,variant=0,previous=[]){
  const chars=Array.from(head),theme=chooseTheme(head,variant),rand=random(hash(head+':'+variant));
  const used=new Set(),endings=new Set(),previousSet=new Set(previous),edited=new Set(theme.lines);
  return chars.map((char,index)=>{
   const choices=candidates(char,theme);
   const rated=choices.map(text=>{const tail=Array.from(text).slice(-5).join(''),ending=Array.from(text).at(-1);return {text,score:(used.has(text)?-100:0)+(previousSet.has(text)?-30:0)+(endings.has(tail.slice(-3))?-20:0)+(edited.has(text)?10:0)+(index===chars.length-1&&/[归安春温亲圆]/.test(ending)?2:0)+rand()*8}}).sort((a,b)=>b.score-a.score);
   const line=rated[0].text;used.add(line);endings.add(Array.from(line).slice(-3).join(''));return line;
  });
 }
 const api={generate,themes,lexicon,tails,sources,bank,candidates};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ZijianAcrosticLibrary=api;
})(typeof globalThis!=='undefined'?globalThis:this);
