function getIndex(list, id) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }

    return -1;
}

const messageApi = Vue.resource('/message{/id}');

Vue.component('message-form', {
    props: ['messages', 'messageAttr'],
    data: function() {
        return {
            id: '', text: ''
        }
    },
    watch: {
        messageAttr: function(newVal, oldVal)   {
            this.id = newVal.id;
            this.text = newVal.text;
        }
    },
    template:
        '<div>' +
            '<input type="text" placeholder="Write something" v-model="text" />' +
            '<input type="button" value="Save" @click="save" />' +
        '</div>',
    methods: {
        save: function() {
            const message = {text: this.text};
            if (this.id) {
                messageApi.update({id: this.id}, message).then(result => result.json()).then(data => {
                    const index = getIndex(this.messages, this.id);
                    this.messages.splice(index, 1, data);
                    this.text = '';
                    this.id = '';
                });
            } else {
                messageApi.save({}, message).then(result => result.json()).then(data => {
                    this.messages.push(data);
                    this.text = '';
                });
            }
        }
    }
});

Vue.component('message-row', {
    props: ['message', 'editMethod', 'messages'],
    template:
        '<div style="height: 30px;">' +
            '<i>({{ message.id }})</i> {{ message.text }}' +
            '<span style="position: absolute; right: 0;">' +
                '<input type="button" value="Edit" @click="edit" />' +
                '<input type="button" value="X" @click="del" />' +
            '</span>' +
        '</div>',
    methods: {
        edit: function() {
            this.editMethod(this.message);
        },
        del: function() {
            messageApi.remove({id: this.message.id}).then(result => {
                if (result.ok) {
                    const index = this.messages.indexOf(this.message);
                    this.messages.splice(index, 1);
                }
            })
        }
    }
});

Vue.component('messages-list', {
    props: ['messages'],
    data: function() {
        return { message: null };
    },
    template:
        '<div style="position: relative; width: 300px;">' +
            '<message-form :messages="messages" :messageAttr="message" />' +
            '<message-row v-for="m in messages" :key="m.id" :message="m" :editMethod="editMethod" ' +
                ':messages="messages" />' +
        '</div>',
    created: function() {
        messageApi.get()
            .then(result => result.json())
            .then(data => data.forEach(message => this.messages.push(message)));
    },
    methods: {
        editMethod: function(message) {
            this.message = message;
        }
    }
});

const app = new Vue({
    el: '#app',
    template: '<messages-list :messages="messages" />',
    data: {
        messages: []
    }
});