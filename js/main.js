(function(){
	var Util = (function(){
		var prefix = 'html5_reader_';
		var StorageGetter = function(key){
			return localStorage.getItem(prefix + key);
		}
		var StorageSetter = function(key,val){
			return localStorage.setItem(prefix + key,val);
		}
		return{
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
	}

	function main(){
		EventHanlder();
	}
	function ReaderModel(){
		//数据交互
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
		$('#night').click(function(){
			//触发 切换背景
		});
	}

    main();
})();