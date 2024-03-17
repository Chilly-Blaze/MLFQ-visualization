<template>
	<div class="doing">
		<n-card :title="'CPU ' + hint[ising]">
			<template #header-extra>
				{{
					_.isEmpty(store.doing)
						? '无任务'
						: store.doing.title
						? store.doing.title +
						  '(' +
						  store.doing.done +
						  '/' +
						  store.doing.total +
						  ')'
						: store.doing.done + '/' + store.doing.total
				}}
			</template>
			<Progressv :p="progress" :ishidden="false"></Progressv>
		</n-card>
	</div>
</template>

<script setup lang="ts">
	import { useStore } from '@/pinia'
	import { NCard } from 'naive-ui'
	import { computed, readonly, ref, watch } from 'vue'
	import { sleep } from '@/hooks'
	import _ from 'lodash'
	import Progressv from './Progress.vue'
	import gsap from 'gsap'
	const store = useStore()
	// 判断当前是否存在执行任务，不然则清空进度条状态
	const progress = computed(() =>
		_.isEmpty(store.doing)
			? { done: 0, total: 1, id: -1, color: '#000000' }
			: _.omit(store.doing, ['title', 'qn']),
	)
	// 用于根据ising信号量标识不同的CPU状态
	const hint = readonly([
		'正在处理任务...',
		'调度中...',
		'休息中...',
		'终止中...',
	])
	// ising信号量，2表示休息
	const ising = ref(2)
	// 暴露信号量
	defineExpose({ ising })
	// 监控信号量变化，保证操作正确
	watch(ising, async (n, o) => {
		// 处理任务
		if (!n) {
			// 动画时间
			const min = Math.min(
				store.doing.done +
					Math.pow(2, store.doing.qn) * store.global.timeSlice,
				store.doing.total,
			)
			// 动画速度
			const speed = (min - store.doing.done) / store.global.cpuSpeed
			// 人为延时
			await sleep(0.5)
			// 异步动画
			gsap.to(store.doing, {
				done: min,
				duration: speed,
				ease: 'none',
			})
			// 人为延时
			await sleep(speed + 0.5)
			// 执行结束，状态改变
			if (!ising.value) {
				ising.value = 1
			}
			// 调度状态
		} else if (n === 1) {
			// 如果接下来还有任务则执行，不然休息
			if (await store.todoing()) {
				ising.value = 0
			} else {
				ising.value = 2
			}
			// 中断状态（仅有外部控制）
		} else if (n === 3) {
			// 人为延时
			await sleep(0.5)
			// 保证下一个任务不入列
			store.todoing(false)
			// 休息
			ising.value = 2
		}
	})
</script>

<style lang="scss" scoped>
	.doing {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
