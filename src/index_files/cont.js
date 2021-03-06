window.cont = new (function(){
	var _this = this;
	var it79 = require('iterate79');
	var php = require('phpjs');

	this.init = function(){
		/**
		 * initialize
		 */
		main.init(function(){
			it79.fnc({}, [
				function(it1, data){
					console.log('setup env...');
					document.querySelector('.cont_project_list').innerHTML = main.getLoadingImage().outerHTML;
					setTimeout(function(){
						it1.next(data);
					}, 10);
				},
				function(it1, data){
					// プロジェクト一覧を取得
					main.socket.send('getProjectAll', {}, function(projects){
						data.projects = projects;
						it1.next(data);
					});
				} ,
				function(it1, data){
					// プロジェクト一覧を描画
					var tpl = $('#template-projectList').html();
					var $ul = $('<div class="list-group">');
					it79.ary(
						data.projects,
						function(it2, row, idx){
							// console.log(row);
							var html =
								twig({data: tpl})
								.render({projectIdx: idx, data: row})
							;
							$ul.append(html);
							it2.next();
						},
						function(){
							$('.cont_project_list').html('').append($ul);
							it1.next();
						}
					);
					console.log(data);
					it1.next(data);
				} ,
				function(it1, data){
					console.log('Started!');
				}
			]);
		});
	}

	/**
	 * 新しいプロジェクトを追加する
	 *
	 * @param  {[type]} form  [description]
	 * @param  {[type]} modal [description]
	 * @return {[type]}       [description]
	 */
	this.createNewProject = function(form, modal){
		// プロジェクトを追加
		var value = {
			name: $(form).find('[name=name]').val(),
			path: $(form).find('[name=path]').val(),
			entry_script: $(form).find('[name=entry_script]').val()
		};
		main.socket.send('createNewProject', value, function(result){
			// alert(result);
			$(modal).modal('hide');
			_this.init();
		});
		return this;
	}

	/**
	 * プロジェクトを削除する
	 *
	 * @param  {[type]} projectIdx [description]
	 * @return {[type]}            [description]
	 */
	this.removeProject = function( projectIdx ){
		if( !confirm('本当に削除してよろしいですか？') ){
			return this;
		}
		main.socket.send('removeProject', {'projectIdx': projectIdx}, function(result){
			// alert(result);
			_this.init();
		});
		return this;
	}

})();
