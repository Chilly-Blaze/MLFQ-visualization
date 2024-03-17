<template>
	<n-card style="width: 600px" title="高级设置" :bordered="false">
		<n-space align="center">
			队列个数（当前{{ store.global.queueNum }}）:
			<n-button @click="deal(true)">加一个</n-button>
			<n-button @click="deal(false)">减一个</n-button>
		</n-space>
		<n-space align="center">
			最高优先级队列占用时间片，当前为
			<n-input-number
				v-model:value="store.global.timeSlice"
				:min="0.01"
				:precision="2"
			></n-input-number>
		</n-space>
		<n-space align="center">
			CPU运行速度，当前一秒运行
			<n-input-number
				v-model:value="store.global.cpuSpeed"
				:min="0.01"
				:precision="2"
			></n-input-number>
			个时间片
		</n-space>
	</n-card>
</template>

<script setup lang="ts">
	import { NCard, NSpace, NButton, NInputNumber } from 'naive-ui'
	import { useStore } from '@/pinia'
	const store = useStore()
	// 处理队列的增减，加了一些判断防止误操作队列数<1
	const deal = (f: boolean) => {
		if (f) {
			store.queue.push([])
			store.global.queueNum++
		} else if (store.global.queueNum > 1) {
			store.queue.pop()
			store.global.queueNum--
		}
	}
</script>

<style lang="scss" scoped></style>
