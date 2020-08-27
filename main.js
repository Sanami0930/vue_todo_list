// https://jp.vuejs.org/v2/examples/todomvc.html
// ローカルストレージAPIを使用して、データをローカルストレージに保存
var STORAGE_KEY = 'todos-vuejs'
var todoStorage = {
    fetch: function(){
        var todos = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '[]'
        )
        todos.forEach(function(todo, index){
            todo.id = index
        })
        todoStorage.uid = todos.length
        return todos
    },
    save: function(todos){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
}

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    
    data() {
        return{
            appName: 'ToDo LIST',

            addDialog: false,

            deleteDialog: false,
            deleteID: null,

            // 使用するデータ
            todos:[],

            options: [
                { value: -1, label: 'すべて'},
                { value: 0, label: '作業中'},
                { value: 1, label: '完了'}
            ],

            // 選択している options の value を記憶するためのデータ
            // 初期値を「-1」つまり「すべて」にする
            current: -1,

            task: '',
            rules: [v => v.length <= 25 || '入力可能な文字数は最大25文字までです。'],
        }
    },

    created(){
        // インスタンス作成時に自動的に fetch() する
        this.todos = todoStorage.fetch()
    },

    watch: {
        // オプションを使う場合はオブジェクト形式にする
        todos: {
            // 引数はウォッチしているプロパティの変更後の値
            handler: function(todos){
                todoStorage.save(todos)
            },
            // deep オプションでネストているデータも監視可能
            deep: true
        }
    },

    computed: {

        labels(){
            return this.options.reduce(function(a, b){
                return Object.assign(a, { [b.value]: b.label})
            }, {})
            // キーから見つけやすいように、次のように加工したデータを作成
            // {0: '作業中', 1: '完了', -1: 'すべて'}
        },

        computedTodos: function(){
            // データ current が -1 ならすべて
            // それ以外なら current と state が一致するものだけに絞り込む
            return this.todos.filter(function(el){
                return this.current < 0 ? true : this.current === el.state
            }, this)
        }
    },

    methods: {

        //追加確認のダイアログ表示
        addConfirm() {
            this.task = ""
            this.addDialog = true
        },

        // ToDo 追加の処理
        doAdd(){

            // 入力がなければ何もしないで return
            if(!this.task.length){
                return
            }

            // { 新しいID, タスク名, 作業状態 }
            // というオブジェクトを現在の todos リストへ push
            // 作業状態「state」は、デフォルト「作業中=0」で作成
            this.todos.push({
                id: todoStorage.uid++,
                comment: this.task,
                state: 0
            })

            // フォーム要素を空にする
            this.task = ""

            this.addDialog = false
        },
 
        // 状態変更の処理
        doChangeState: function(item){
          item.state = !item.state ? 1 : 0
        },

        //削除確認のダイアログ表示
        deleteConfirm(id) {
            this.deleteDialog = true
            this.deleteID = id
        },

          // 削除の処理
        doRemove(id){
            this.todos.splice(id, 1)
            this.deleteDialog = false
            window.location.reload();
        },

    }
  })