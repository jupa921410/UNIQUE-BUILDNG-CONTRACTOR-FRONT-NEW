import fs from 'node:fs';
import sharp from 'sharp';
const {data}=JSON.parse(fs.readFileSync('.portfolio-audit.json'));
const tiles=[];let i=0;
for(const p of data)for(const im of p.images.filter(x=>x.media_type==='image')){const b=Buffer.from(await(await fetch(im.url)).arrayBuffer());await fs.promises.writeFile(`.review/${im.id}.jpg`,b);const tile=await sharp(b).resize(180,120,{fit:'contain',background:'#eee'}).extend({bottom:25,background:'#fff'}).composite([{input:Buffer.from(`<svg width="180" height="25"><text x="5" y="18" font-size="14">${p.id} / ${im.id}</text></svg>`),top:120,left:0}]).jpeg().toBuffer();tiles.push({input:tile,left:(i%6)*180,top:Math.floor(i/6)*145});i++;}
await sharp({create:{width:1080,height:Math.ceil(i/6)*145,channels:3,background:'#fff'}}).composite(tiles).jpeg().toFile('.review/sheet.jpg');
