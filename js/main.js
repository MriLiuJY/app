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
					callback(data);
				}
			})
		}
		return{
			getBSONP : getBSONP,
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
	}
	var Win = $(window);
	var Doc = $(document);
	var RootContainer = $('.m-body');
	var initFontSize = 20;

	function main(){
		var readerModel = ReaderModel();
		readerModel.init();
		EventHanlder();
	}
	function ReaderModel(){
		//数据交互
		var Chapter_id;
		var init = function(){
			getFictionInfo(function(){
				getCurChapterContent(Chapter_id,function(){
					// 渲染
				});
			})
		}
		var getFictionInfo =function(callback){
			$.get('data/chapter.json',function(data){
				Chapter_id = data.chapters[1].chapter_id;
				callback && callback();
			},'json')
		}
		var getCurChapterContent = function(chapter_id,data){
			$.get('data/data' + chapter_id + '.json',function(data){
				if (data.result == 0) {
					var url = data.jsonp;
					Util.getBSONP(url , function(data){
						callback && callback(data);
					});
				}
			},'json')
		}
		return{
			init : init
		}	
	}
	function ReaderBaseFrame(){
		//渲染ui
	}
	function EventHanlder(){
		//交互
		$('#cation-mid').click(function(){
			if(Dom.m_nav.css('display') == 'none') {
				Dom.m_nav.show();
				Dom.m_footer_und.show();
			}else{
				Dom.m_nav.hide();
				Dom.m_footer_und.hide();
				Dom.m_footer_pannel.hide();
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
	}

    main();
})();