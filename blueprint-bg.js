// Veritas blueprint background — animated architectural sheet drawn on a
// <canvas>. Draws a floor plan, front elevation, and title block that gently
// draft in and out while a slow camera glides over the sheet. Auto-pauses
// when scrolled out of view. Drop a <div class="veritas-bp"><canvas></canvas></div>
// as the first child of a position:relative section; tune via data-line-color,
// data-accent-color, data-intensity.
(function(){
  function init(root){
    var canvas = root.querySelector('canvas');
    if(!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio||1, 2);
    var W=0, H=0, figs=[], raf=null;

    var lineColor = root.getAttribute('data-line-color') || '#dfe9f5';
    var accentColor = root.getAttribute('data-accent-color') || '#5f95cf';
    var intensity = parseFloat(root.getAttribute('data-intensity')) || 1;

    function ease(t){ return t<0.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2; }
    function polyLen(p){ var l=0; for(var i=1;i<p.length;i++) l+=Math.hypot(p[i].x-p[i-1].x,p[i].y-p[i-1].y); return l; }
    function hexA(hex,a){ var h=hex.replace('#',''); if(h.length===3){h=h.split('').map(function(c){return c+c;}).join('');} var n=parseInt(h,16); return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')'; }
    function seg(x1,y1,x2,y2){ return [{x:x1,y:y1},{x:x2,y:y2}]; }
    function rect(x,y,w,h){ return [{x:x,y:y},{x:x+w,y:y},{x:x+w,y:y+h},{x:x,y:y+h},{x:x,y:y}]; }
    function pl(){ var a=[]; for(var i=0;i<arguments.length;i++){a.push({x:arguments[i][0],y:arguments[i][1]});} return a; }
    function arc(cx,cy,r,a0,a1,n){ n=n||40; var a=[]; for(var i=0;i<=n;i++){ var t=a0+(a1-a0)*i/n; a.push({x:cx+Math.cos(t)*r,y:cy+Math.sin(t)*r}); } return a; }
    function circle(cx,cy,r,n){ return arc(cx,cy,r,0,Math.PI*2,n||64); }
    function dimLine(x1,y1,x2,y2,stations){
      var out=[seg(x1,y1,x2,y2)], dx=x2-x1, dy=y2-y1, len=Math.hypot(dx,dy)||1, ux=dx/len, uy=dy/len, k=5;
      stations.forEach(function(s){ var sx=x1+dx*s, sy=y1+dy*s, vx=ux-uy, vy=uy+ux, m=Math.hypot(vx,vy)||1; out.push(seg(sx-vx/m*k, sy-vy/m*k, sx+vx/m*k, sy+vy/m*k)); });
      return out;
    }
    function hatch(x,y,w,h,gap){ gap=gap||8; var out=[];
      for(var o=gap;o<w+h;o+=gap){ var ax=x+o, tHi=(ax-x)/h, tLo=(ax-(x+w))/h, t0=Math.max(0,tLo), t1=Math.min(1,tHi); if(t1<=t0) continue; out.push(seg(ax-h*t0,y+h*t0,ax-h*t1,y+h*t1)); }
      return out;
    }

    function build(){
      figs=[];
      function add(polys,period,offset,opt){ opt=opt||{}; figs.push({polys:polys,period:period,offset:offset,width:opt.width||1.1,accent:!!opt.accent,maxAlpha:opt.maxAlpha==null?0.85:opt.maxAlpha,labels:opt.labels||[]}); }
      var i,j;

      // ===== A. Main level — detailed floor plan (upper-left) =====
      (function(){
        var pw=Math.min(W*0.30,400), h1=Math.min(H*0.30,220), h2=Math.min(H*0.34,250);
        var x0=W*0.045, y0=H*0.10, t=7;
        var wingW=pw*0.60, vA=x0+pw*0.34, vB=x0+wingW, R=x0+pw, BT=y0+h1, BB=y0+h1+h2;
        var xi=x0+t, yi=y0+t, ri=R-t, p=[], labels=[], i, j, k;
        var DW=15, FDW=20, gFD=vA+(vB-vA)*0.32;
        p.push(seg(x0,y0,gFD-FDW/2,y0)); p.push(seg(gFD+FDW/2,y0,R,y0));
        p.push(seg(R,y0,R,BT)); p.push(seg(R,BT,vB,BT));
        p.push(seg(vB,BT,vB,BB)); p.push(seg(vB,BB,x0,BB)); p.push(seg(x0,BB,x0,y0));
        p.push(seg(xi,yi,gFD-FDW/2,yi)); p.push(seg(gFD+FDW/2,yi,ri,yi));
        p.push(seg(ri,yi,ri,BT-t)); p.push(seg(ri,BT-t,vB-t,BT-t));
        p.push(seg(vB-t,BT-t,vB-t,BB-t)); p.push(seg(vB-t,BB-t,xi,BB-t)); p.push(seg(xi,BB-t,xi,yi));
        p.push(seg(gFD-FDW/2,y0,gFD-FDW/2,yi)); p.push(seg(gFD+FDW/2,y0,gFD+FDW/2,yi));
        p.push(seg(gFD-FDW/2,yi,gFD-FDW/2,yi+FDW)); p.push(arc(gFD-FDW/2,yi,FDW,Math.PI/2,0,14));
        labels.push({x:gFD,y:yi+FDW+8,text:'ENTRY',size:5,center:true});
        function vwall(x,ya,yb,gaps){ var cur=ya; (gaps||[]).slice().sort(function(a,b){return a-b;}).forEach(function(g){ p.push(seg(x,cur,x,g-DW/2)); cur=g+DW/2; }); p.push(seg(x,cur,x,yb)); }
        function hwall(y,xa,xb,gaps){ var cur=xa; (gaps||[]).slice().sort(function(a,b){return a-b;}).forEach(function(g){ p.push(seg(cur,y,g-DW/2,y)); cur=g+DW/2; }); p.push(seg(cur,y,xb,y)); }
        function vdoor(x,gy,dir){ var hy=gy-DW/2; p.push(seg(x,hy,x+dir*DW,hy)); p.push(arc(x,hy,DW,dir>0?0:Math.PI,Math.PI/2,12)); }
        function hdoor(y,gx,dir){ var hx=gx-DW/2; p.push(seg(hx,y,hx,y+dir*DW)); p.push(arc(hx,y,DW,dir>0?Math.PI/2:-Math.PI/2,0,12)); }
        function bed(bx,by,bw,bh){ p.push(rect(bx,by,bw,bh)); p.push(seg(bx,by+bh*0.78,bx+bw,by+bh*0.78)); p.push(rect(bx+bw*0.08,by+bh*0.82,bw*0.36,bh*0.15)); p.push(rect(bx+bw*0.56,by+bh*0.82,bw*0.36,bh*0.15)); }
        var hK=y0+h1*0.50, hP=BT+h2*0.56, hHall=BT+h2*0.34;
        var dGF=(yi+BT)/2, dFK=(yi+hK)/2, dPH=BT+h2*0.18, dPW=BT+h2*0.45, dPE=(xi+vA)/2;
        vwall(vA,yi,BB-t,[dGF,dPH,dPW]); vwall(vB,yi,BT,[dFK]);
        p.push(seg(xi,BT,vA,BT)); p.push(seg(vB,hK,ri,hK));
        p.push(seg(vA,hHall,vB,hHall)); hwall(hP,xi,vA,[dPE]);
        vdoor(vA,dGF,1); vdoor(vA,dPH,1); vdoor(vB,dFK,1); vdoor(vA,dPW,1); hdoor(hP,dPE,1);
        var cl,cr,ct,cb,ccx,ccy,sx,sy,sw,sh,tw,th,chx;
        cl=xi; cr=vA; ct=yi; cb=BT; ccx=(cl+cr)/2;
        p.push(rect(cl+8,ct+8,(cr-cl)-16,(cb-ct)-16)); p.push(rect(cl,(ct+cb)/2-12,7,24));
        p.push(rect(cl+10,cb-16,(cr-cl)*0.5,11)); p.push(rect(ccx-9,(ct+cb)/2-5,18,12));
        labels.push({x:ccx,y:ct+(cb-ct)*0.34,text:'GREAT ROOM',size:6,center:true});
        cl=vA; cr=vB; ct=yi; cb=BT;
        sx=cl+(cr-cl)*0.46; sy=ct+8; sw=(cr-cl)*0.44; sh=(cb-ct)*0.62;
        p.push(rect(sx,sy,sw,sh));
        for(k=1;k<8;k++) p.push(seg(sx,sy+sh*k/8,sx+sw,sy+sh*k/8));
        p.push(seg(sx+sw/2,sy+sh-5,sx+sw/2,sy+8)); p.push(pl([sx+sw/2-4,sy+15],[sx+sw/2,sy+8],[sx+sw/2+4,sy+15]));
        labels.push({x:cl+(cr-cl)*0.26,y:cb-9,text:'FOYER',size:6,center:true});
        cl=vB; cr=ri; ct=yi; cb=hK; ccx=(cl+cr)/2; ccy=(ct+cb)/2;
        p.push(seg(cl,ct+12,cr-12,ct+12)); p.push(seg(cr-12,ct+12,cr-12,cb));
        p.push(rect(ccx-(cr-cl)*0.20,ccy-5,(cr-cl)*0.40,12));
        p.push(rect(cl+(cr-cl)*0.10,ct+3,(cr-cl)*0.18,8)); p.push(rect(cl+(cr-cl)*0.50,ct+3,(cr-cl)*0.22,8));
        for(i=0;i<2;i++)for(j=0;j<2;j++) p.push(arc(cl+(cr-cl)*0.56+i*(cr-cl)*0.09,ct+5+j*3.5,1.8,0,Math.PI*2,8));
        labels.push({x:ccx,y:cb-6,text:'KITCHEN',size:6,center:true});
        cl=vB; cr=ri; ct=hK; cb=BT; ccx=(cl+cr)/2; ccy=(ct+cb)/2;
        tw=(cr-cl)*0.44; th=(cb-ct)*0.42;
        p.push(rect(ccx-tw/2,ccy-th/2,tw,th));
        for(k=0;k<3;k++){ chx=ccx-tw*0.3+k*tw*0.3; p.push(rect(chx-4,ccy-th/2-8,8,6)); p.push(rect(chx-4,ccy+th/2+2,8,6)); }
        labels.push({x:ccx,y:cb-6,text:'DINING',size:6,center:true});
        cl=xi; cr=vA; ct=BT; cb=hP; ccx=(cl+cr)/2;
        var pbw=(cr-cl)*0.5, pbh=(cb-ct)*0.42, pbx=ccx-pbw/2, pby=ct+10;
        p.push(rect(pbx,pby,pbw,pbh));
        p.push(seg(pbx,pby+pbh*0.22,pbx+pbw,pby+pbh*0.22));
        p.push(rect(pbx+pbw*0.10,pby+pbh*0.03,pbw*0.34,pbh*0.14)); p.push(rect(pbx+pbw*0.56,pby+pbh*0.03,pbw*0.34,pbh*0.14));
        p.push(rect(pbx-12,pby+2,9,9)); p.push(rect(pbx+pbw+3,pby+2,9,9));
        labels.push({x:ccx,y:cb-9,text:'PRIMARY',size:6,center:true});
        cl=xi; cr=vA; ct=hP; cb=BB; ccx=(cl+cr)/2;
        var ew=cr-cl, eh=cb-ct;
        p.push(rect(cl+5,cb-eh*0.42,ew*0.46,eh*0.36));
        p.push(arc(cl+5+ew*0.36,cb-eh*0.24,3,0,Math.PI*2,10));
        p.push(rect(cr-ew*0.40,cb-eh*0.24,ew*0.34,eh*0.18));
        p.push(arc(cr-ew*0.23,cb-eh*0.15,3,0,Math.PI*2,10));
        p.push(arc(cr-ew*0.20,cb-eh*0.52,5,0,Math.PI*2,12));
        labels.push({x:ccx,y:ct+eh*0.26,text:'ENSUITE',size:5,center:true});
        cl=vA; cr=vB; ct=BT; cb=hHall;
        labels.push({x:(cl+cr)/2,y:(ct+cb)/2+2,text:'HALL',size:5,center:true});
        cl=vA; cr=vB; ct=hHall; cb=BB;
        for(k=0;k<5;k++) p.push(seg(cl+6,ct+10+k*8,cr-6,ct+10+k*8));
        p.push(rect(cl+(cr-cl)*0.30,ct+(cb-ct)*0.56,(cr-cl)*0.40,(cb-ct)*0.16));
        labels.push({x:(cl+cr)/2,y:cb-7,text:'W.I.C.',size:5,center:true});
        var dyT=y0-14;
        p.push.apply(p,dimLine(x0,dyT,R,dyT,[0,0.34,0.60,1]));
        p.push(seg(x0,dyT-5,x0,y0-2)); p.push(seg(vA,dyT-5,vA,y0+2)); p.push(seg(vB,dyT-5,vB,y0+2)); p.push(seg(R,dyT-5,R,y0-2));
        labels.push({x:(x0+vA)/2,y:dyT-4,text:"15'-0\"",size:6,center:true});
        labels.push({x:(vA+vB)/2,y:dyT-4,text:"12'-0\"",size:6,center:true});
        labels.push({x:(vB+R)/2,y:dyT-4,text:"17'-0\"",size:6,center:true});
        var dxL=x0-14;
        p.push.apply(p,dimLine(dxL,y0,dxL,BB,[0,h1/(h1+h2),1]));
        p.push(seg(dxL-5,y0,x0-2,y0)); p.push(seg(dxL-5,BT,x0-2,BT)); p.push(seg(dxL-5,BB,x0-2,BB));
        p.push(arc(R+18,y0+h1*0.3,11,0,Math.PI*2,22)); p.push(seg(R+7,y0+h1*0.3,R-2,y0+h1*0.3));
        labels.push({x:R+18,y:y0+h1*0.3,text:'A',size:8,center:true,mid:true});
        labels.push({x:x0,y:BB+20,text:'FLOOR PLAN — MAIN LEVEL',size:9});
        labels.push({x:x0,y:BB+33,text:'SCALE  1/4" = 1\'-0"',size:7});
        add(p,22,0,{maxAlpha:0.8,width:1.1,labels:labels});
      })();

      // ===== B. Grand residence — front elevation (right) =====
      (function(){
        var bw=Math.min(W*0.30,430), bh=Math.min(H*0.50,380);
        var x0=W*0.96-bw, y0=H*0.45-bh/2, gl=y0+bh, cx=x0+bw/2, p=[], labels=[], k;
        p.push(seg(x0-16,gl,x0+bw+16,gl));
        p.push.apply(p,hatch(x0-4,gl,bw+8,12,9));
        var mainW=bw*0.50, mainX=cx-mainW/2, mainTop=y0+bh*0.26;
        var wingW=bw*0.235, wingTop=y0+bh*0.46, lX=x0, rX=x0+bw-wingW;
        p.push(rect(lX,wingTop,wingW,gl-wingTop)); p.push(rect(rX,wingTop,wingW,gl-wingTop));
        p.push(seg(mainX,gl,mainX,mainTop)); p.push(seg(mainX+mainW,gl,mainX+mainW,mainTop));
        p.push(seg(mainX,mainTop,mainX+mainW,mainTop));
        var ridgeY=y0+bh*0.085;
        p.push(pl([mainX-8,mainTop],[cx,ridgeY],[mainX+mainW+8,mainTop]));
        p.push(pl([lX-5,wingTop],[lX+wingW*0.5,wingTop-bh*0.095],[lX+wingW+5,wingTop]));
        p.push(pl([rX-5,wingTop],[rX+wingW*0.5,wingTop-bh*0.095],[rX+wingW+5,wingTop]));
        p.push(circle(cx,mainTop-(mainTop-ridgeY)*0.42,bw*0.026,24));
        var bandY=y0+bh*0.555;
        p.push(seg(mainX,bandY,mainX+mainW,bandY)); p.push(seg(mainX,bandY+4,mainX+mainW,bandY+4));
        for(k=0;k<6;k++){ var qy=mainTop+(gl-mainTop)*0.04+k*bh*0.05, qw=bw*0.02; p.push(rect(mainX,qy,qw,bh*0.03)); p.push(rect(mainX+mainW-qw,qy,qw,bh*0.03)); }
        function winM(wx,wy,ww,wh){ p.push(rect(wx,wy,ww,wh)); p.push(seg(wx+ww/2,wy,wx+ww/2,wy+wh)); p.push(seg(wx,wy+wh/2,wx+ww,wy+wh/2)); p.push(rect(wx-ww*0.34,wy,ww*0.28,wh)); p.push(rect(wx+ww+ww*0.06,wy,ww*0.28,wh)); }
        var mw=mainW*0.13, mh=bh*0.13, my=mainTop+bh*0.07;
        for(k=0;k<3;k++) winM(mainX+mainW*(0.24+0.26*k)-mw/2,my,mw,mh);
        function archW(wx,wy,ww,wh){ p.push(rect(wx,wy,ww,wh)); p.push(arc(wx+ww/2,wy,ww/2,Math.PI,Math.PI*2,16)); p.push(seg(wx+ww/2,wy-ww/2,wx+ww/2,wy+wh)); p.push(seg(wx,wy+wh*0.5,wx+ww,wy+wh*0.5)); }
        var aw=mainW*0.15, ah=bh*0.21, ay=gl-ah-bh*0.015;
        archW(mainX+mainW*0.10,ay,aw,ah); archW(mainX+mainW*0.90-aw,ay,aw,ah);
        var poW=mainW*0.40, poX=cx-poW/2, entY=bandY-bh*0.005;
        p.push(seg(poX-8,entY,poX+poW+8,entY)); p.push(seg(poX-8,entY+5,poX+poW+8,entY+5));
        p.push(pl([poX-8,entY],[cx,entY-bh*0.085],[poX+poW+8,entY]));
        for(k=0;k<4;k++){ var colx=poX+poW*(k/3); p.push(seg(colx-2,entY+5,colx-2,gl)); p.push(seg(colx+2,entY+5,colx+2,gl)); p.push(seg(colx-5,gl,colx+5,gl)); }
        var dW=poW*0.34, dX=cx-dW/2, dTop=entY+bh*0.05;
        p.push(rect(dX,dTop,dW,gl-dTop)); p.push(seg(cx,dTop,cx,gl));
        p.push(arc(cx,dTop,dW*0.7,Math.PI,Math.PI*2,20));
        function wWin(wx,wy,ww,wh){ p.push(rect(wx,wy,ww,wh)); p.push(seg(wx+ww/2,wy,wx+ww/2,wy+wh)); p.push(seg(wx,wy+wh/2,wx+ww,wy+wh/2)); }
        [lX,rX].forEach(function(wb){ wWin(wb+wingW*0.28,wingTop+bh*0.06,wingW*0.44,bh*0.10); wWin(wb+wingW*0.28,gl-bh*0.16,wingW*0.44,bh*0.12); });
        var rt=y0+bh*0.085, tot=gl-rt, dxr=x0+bw+16;
        p.push.apply(p,dimLine(dxr,rt,dxr,gl,[0,(mainTop-rt)/tot,(bandY-rt)/tot,1]));
        p.push(seg(x0+bw+2,gl,dxr+5,gl)); p.push(seg(x0+bw+2,bandY,dxr+5,bandY));
        labels.push({x:x0,y:gl+30,text:'FRONT ELEVATION',size:9});
        labels.push({x:x0,y:gl+43,text:'SCALE  1/4" = 1\'-0"',size:7});
        add(p,22,11,{maxAlpha:0.78,width:1.05,labels:labels});
      })();

      // ===== C. Title block (bottom-right) =====
      (function(){
        var bw3=Math.min(W*0.24,320), bh3=92, x0=W*0.95-bw3, y0=H*0.96-bh3, p=[], labels=[];
        p.push(rect(x0,y0,bw3,bh3));
        p.push(seg(x0,y0+26,x0+bw3,y0+26));
        p.push(seg(x0+bw3*0.58,y0+26,x0+bw3*0.58,y0+bh3));
        p.push(seg(x0,y0+26+(bh3-26)/2,x0+bw3*0.58,y0+26+(bh3-26)/2));
        p.push(seg(x0+bw3*0.58,y0+26+(bh3-26)*0.5,x0+bw3,y0+26+(bh3-26)*0.5));
        p.push(pl([x0+bw3-20,y0+13],[x0+bw3-10,y0+13],[x0+bw3-15,y0+5],[x0+bw3-20,y0+13]));
        labels.push({x:x0+10,y:y0+17,text:'VERITAS BUILDERS',size:9});
        labels.push({x:x0+10,y:y0+40,text:'PROJECT',size:6});
        labels.push({x:x0+10,y:y0+52,text:'MASTER BEDROOM',size:7});
        labels.push({x:x0+10,y:y0+73,text:'DRAWN  VB',size:6});
        labels.push({x:x0+10,y:y0+85,text:'DATE  06 / 26',size:6});
        labels.push({x:x0+bw3*0.58+9,y:y0+40,text:'SHEET',size:6});
        labels.push({x:x0+bw3*0.58+9,y:y0+59,text:'A-101',size:13});
        labels.push({x:x0+bw3*0.58+9,y:y0+80,text:'SCALE 1/4"',size:6});
        add(p,24,6,{width:1,maxAlpha:0.5,labels:labels});
      })();
    }

    function drawUpTo(p,maxLen){
      if(maxLen<=0) return;
      ctx.beginPath(); ctx.moveTo(p[0].x,p[0].y); var acc=0;
      for(var i=1;i<p.length;i++){ var a=p[i-1],b=p[i],s=Math.hypot(b.x-a.x,b.y-a.y);
        if(s===0) continue;
        if(acc+s<=maxLen){ ctx.lineTo(b.x,b.y); acc+=s; }
        else{ var rr=(maxLen-acc)/s; ctx.lineTo(a.x+(b.x-a.x)*rr,a.y+(b.y-a.y)*rr); break; } }
      ctx.stroke();
    }
    function drawFigure(f,dp,a){
      ctx.save();
      ctx.globalAlpha=Math.min(1,a*f.maxAlpha*intensity);
      ctx.strokeStyle=f.accent?accentColor:lineColor;
      ctx.lineWidth=f.width; ctx.lineJoin='round'; ctx.lineCap='round';
      var lens=f.polys.map(polyLen), total=lens.reduce(function(s,v){return s+v;},0), target=dp*total;
      for(var i=0;i<f.polys.length;i++){ if(target<=0) break; drawUpTo(f.polys[i],Math.min(target,lens[i])); target-=lens[i]; }
      if(f.labels && f.labels.length){
        var la=a*Math.max(0,(dp-0.6)/0.4);
        if(la>0.01){
          ctx.globalAlpha=Math.min(1,la*f.maxAlpha*intensity);
          ctx.fillStyle=f.accent?accentColor:lineColor;
          if('letterSpacing' in ctx) ctx.letterSpacing='1px';
          for(var k=0;k<f.labels.length;k++){ var L=f.labels[k];
            ctx.font=(L.size||9)+"px 'IBM Plex Mono', monospace";
            ctx.textAlign=L.center?'center':'left';
            ctx.textBaseline=L.mid?'middle':'alphabetic';
            ctx.fillText(L.text,L.x,L.y);
          }
          if('letterSpacing' in ctx) ctx.letterSpacing='0px';
        }
      }
      ctx.restore();
    }
    function drawGrid(now){
      var cell=46, off=(now*0.004)%cell;
      ctx.save(); ctx.lineWidth=1;
      ctx.strokeStyle=hexA(lineColor,0.055*intensity); ctx.beginPath();
      for(var x=-cell*3+off;x<=W+cell*3;x+=cell){ ctx.moveTo(x,-cell*3); ctx.lineTo(x,H+cell*3); }
      for(var y=-cell*3+off;y<=H+cell*3;y+=cell){ ctx.moveTo(-cell*3,y); ctx.lineTo(W+cell*3,y); }
      ctx.stroke();
      ctx.strokeStyle=hexA(lineColor,0.10*intensity); ctx.beginPath();
      var big=cell*4;
      for(x=-big;x<=W+big;x+=big){ ctx.moveTo(x,-big); ctx.lineTo(x,H+big); }
      for(y=-big;y<=H+big;y+=big){ ctx.moveTo(-big,y); ctx.lineTo(W+big,y); }
      ctx.stroke(); ctx.restore();
    }
    function drawSheet(){
      ctx.save(); ctx.strokeStyle=lineColor; ctx.lineWidth=1; ctx.lineCap='round';
      var m=26;
      ctx.globalAlpha=0.15*intensity; ctx.strokeRect(m,m,W-2*m,H-2*m);
      ctx.globalAlpha=0.09*intensity; ctx.beginPath(); ctx.moveTo(m+16,m); ctx.lineTo(m+16,H-m); ctx.stroke();
      ctx.globalAlpha=0.22*intensity; ctx.beginPath();
      var tk=11, cn=[[m,m,1,1],[W-m,m,-1,1],[m,H-m,1,-1],[W-m,H-m,-1,-1]];
      cn.forEach(function(q){ var x=q[0],y=q[1],sx=q[2],sy=q[3]; ctx.moveTo(x+sx*tk,y); ctx.lineTo(x,y); ctx.lineTo(x,y+sy*tk); });
      ctx.stroke(); ctx.restore();
    }
    function frame(now){
      var ts=now/1000;
      ctx.clearRect(0,0,W,H);
      var camS=1.03+Math.sin(ts*0.05)*0.02, camX=Math.sin(ts*0.045)*16, camY=Math.cos(ts*0.035)*12;
      ctx.save();
      ctx.translate(W/2,H/2); ctx.scale(camS,camS); ctx.translate(-W/2+camX,-H/2+camY);
      drawGrid(now); drawSheet();
      // draw on, hold drawn for a long while, then gently retract (calm)
      var dDraw=0.30, dHold=0.54;
      for(var k=0;k<figs.length;k++){ var f=figs[k], u=((ts+f.offset)%f.period)/f.period, dp;
        if(u<dDraw) dp=ease(u/dDraw);
        else if(u<dDraw+dHold) dp=1;
        else dp=ease(1-(u-dDraw-dHold)/(1-dDraw-dHold));
        if(dp<=0.001) continue;
        drawFigure(f,dp,1);
      }
      ctx.restore();
      raf=requestAnimationFrame(frame);
    }
    function resize(){
      var rct=root.getBoundingClientRect();
      W=rct.width; H=rct.height;
      canvas.width=Math.round(W*dpr); canvas.height=Math.round(H*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      build();
    }

    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){
        es.forEach(function(e){
          if(e.isIntersecting){ if(!raf) raf=requestAnimationFrame(frame); }
          else if(raf){ cancelAnimationFrame(raf); raf=null; }
        });
      }).observe(root);
    }
    window.addEventListener('resize', resize);
    resize();
    frame(performance.now()); // paint first frame immediately, then animate
  }

  function boot(){ document.querySelectorAll('.veritas-bp').forEach(init); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
