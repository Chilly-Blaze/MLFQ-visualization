<template>
	<div class="main">
		<div class="layout">
			<h1>多级反馈队列调度算法</h1>
			<Doing ref="doing"></Doing>
			<n-divider />
			<n-space justify="center">
				<n-input
					placeholder="可以给任务取一个标题(可选)"
					v-model:value="data.title"
				></n-input>
				<n-input-number
					:status="status"
					placeholder="任务总时长(支持两位小数)"
					:min="0"
					:precision="2"
					:show-button="false"
					v-model:value.number="data.total"
					@focus="status = undefined"
				/>
				<n-button @click="submit">插入</n-button>
				<n-button @click="doing.ising = 1">开始</n-button>
				<n-button @click="doing.ising = 3">停止</n-button>
				<n-button @click="showSetting = true">高级设置</n-button>
			</n-space>
			<n-divider />
			<div class="queue-group">
				<ProgressGroup
					v-for="(item, i) in store.queue"
					:key="i"
					:num="i"
				></ProgressGroup>
			</div>
			<n-divider />
			<Done></Done>
			<n-modal v-model:show="showSetting" :block-scroll="false">
				<Setting></Setting>
			</n-modal>
		</div>
	</div>
</template>

<script setup lang="ts">
	import ProgressGroup from './components/ProgressGroup.vue'
	import Done from './components/Done.vue'
	import Doing from './components/Doing.vue'
	import Setting from './components/Setting.vue'
	import {
		NDivider,
		NButton,
		NInput,
		NInputNumber,
		NSpace,
		NModal,
	} from 'naive-ui'
	import { onMounted, reactive, ref } from 'vue'
	import { useStore } from './pinia'
	const store = useStore()
	const status = ref<'error'>()
	const showSetting = ref(false)
	// 新增任务的属性
	const data = reactive({
		title: null as null | string,
		total: null as null | number,
	})
	// 确保输入合法
	const submit = () => {
		if (!data.total) {
			status.value = 'error'
			return
		}
		store.push(0, {
			title: data.title ? data.title : undefined,
			total: data.total!,
			done: 0,
		})
		data.title = null
		data.total = null
	}
	const doing = ref()
</script>

<style lang="scss" scoped>
	.main {
		min-width: 100vw;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		.layout {
			margin: 5em 0;
			width: 70%;
			.queue-group {
				display: flex;
				justify-content: start;
				flex-wrap: wrap;
			}
		}
	}
</style>
