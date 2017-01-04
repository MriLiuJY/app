(function(){
	var Util = (function(){
		var prefix = 'html5_reader_';
		var StorageGetter = function(key){
			return localStorage.getItem(prefix + key);
		}
		var StorageSetter = function(key,val){
			return localStorage.setItem(prefix + key,val);
		}
		var getBSONP = function(url,callback){
			return $.jsonp({
				url : url,
				cache:true,
				callback:'duokan_fiction_chapter',
				success : function(result){
					var data = $.base64.decode(result);
					var json = decodeURIComponent(escape(data));
					callback(json);
				}
			})
		}
		return{
			getBSONP:getBSONP,
			StorageGetter:StorageGetter,
			StorageSetter:StorageSetter
		}
	})();

	var Dom = {
		m_nav : $('.m-nav'),
		m_footer_und : $('.m-footer-und'),
		night : $('#night'),
		footer_und_button : $('.footer-und-button'),
		m_footer_pannel : $('.m-footer-pannel'),
		footer_night : $('.footer-night'),
		bk_container : $('bk-container-current'),
		m_footer : $('m-footer'),
	}
	var Win = $(window);
	var Doc = $(document);
	var readerModel;
	var readerUI;
	var RootContainer = $('.m-body');
	var initFontSize = 20;

	function main(){
		readerModel = ReaderModel();
		readerUI = ReaderBaseFrame(RootContainer);

		readerModel.init(function(data){
			readerUI(data);
		});
		EventHanlder();
	}
	function ReaderModel(){
		//数据交互
		var Chapter_id;
		var ChapterTotal;
		var init = function(UIcallback){
			getFictionInfo(function(){
				getCurChapterContent(Chapter_id,function(data){
					// 渲染
					UIcallback && UIcallback(data);
				});
			})
		}
		var getFictionInfo =function(callback){
			$.get('data/chapter.json',function(data){
				Chapter_id = Util.StorageGetter('last_chapter_id');
				if (Chapter_id == null) {
					Chapter_id = data.chapters[1].chapter_id;
				}
				ChapterTotal =data.chapters.length;
				callback && callback();
			},'json')
		}
		var getCurChapterContent = function(chapter_id,callback){
			$.get('data/data' + chapter_id + '.json',function(data){
				if (data.result == 0) {
					var url = data.jsonp;
					Util.getBSONP(url , function(data){
						callback && callback(data);
					});
				}
			},'json')
		}
		var prevChapter =function(UIcallback){
			Chapter_id = parseInt(Chapter_id,10);
			if (Chapter_id ==0) {
				return;
			}
			Chapter_id -= 1;
			getCurChapterContent(Chapter_id,UIcallback);
			Util.StorageSetter('last_chapter_id',Chapter_id);
		}
		var nextChapter =function(UIcallback){
			Chapter_id = parseInt(Chapter_id,10);
			if (Chapter_id ==ChapterTotal) {
				return;
			}
			Chapter_id += 1;
			getCurChapterContent(Chapter_id,UIcallback);
			Util.StorageSetter('last_chapter_id',Chapter_id);
		}
		return{
			init : init,
			prevChapter : prevChapter,
			nextChapter : nextChapter,
		}	
	}
	function ReaderBaseFrame(container){
		//渲染ui
		function parseChapterData(jsonData){
			var jsonObj = JSON.parse(jsonData);
			var html = '<h4>' + jsonObj.t + '</h4>';
			for(var i = 0;i<jsonObj.p.length;i++){
				html += '<p>' + jsonObj.p[i] + '</p>';
			}
			return html;
		}
		return function(data){
			container.html(parseChapterData(data));
		}
	}
	function EventHanlder(){
		//交互
		$('#cation-mid').click(function(){
			if(Dom.m_nav.css('display') == 'none') {
				Dom.m_nav.show();
				Dom.m_footer_und.show();
				Dom.m_footer.show();
			}else{
				Dom.m_nav.hide();
				Dom.m_footer_und.hide();
				Dom.m_footer_pannel.hide();
				Dom.m_footer.hide();
			}
		});
		$('.footer-und-button').click(function(){
			if(Dom.m_footer_pannel.css('display') == 'none') {
				Dom.m_footer_pannel.show();
			}else{
				Dom.m_footer_pannel.hide();
			}
		});
		$('.footer-night').click(function(){
			if (Dom.footer_night) {}
		});

		$('#night').click(function(){
			//触发 切换背景
		});
		$('#font-big').click(function(){
			initFontSize += 1;
			RootContainer.css('font-size',initFontSize);
		});
		$('#font-small').click(function(){
			initFontSize -= 1;
			RootContainer.css('font-size',initFontSize);
		});
		$('#bk-container-1').click(function(){
			RootContainer.addClass('color-1');
			RootContainer.removeClass('color-2')
			RootContainer.removeClass('color-3')
		});
		$('#bk-container-2').click(function(){
			RootContainer.addClass('color-2');
			RootContainer.removeClass('color-1')
			RootContainer.removeClass('color-3')
		});
		$('#bk-container-3').click(function(){
			RootContainer.addClass('color-3');
			RootContainer.removeClass('color-1')
			RootContainer.removeClass('color-2')
		});

		Win.scroll(function(){
			Dom.m_nav.hide();
			Dom.m_footer_und.hide();
			Dom.m_footer_pannel.hide();
		});

		$('#prev_button').click(function(){
			readerModel.prevChapter(function(data){
				readerUI(data);
			});
		});
		$('#next_button').click(function(){
			readerModel.nextChapter(function(data){
				readerUI(data);
			});
		});
	}

    main();
})();