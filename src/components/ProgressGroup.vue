<template>
	<n-card :title="'队列' + (props.num + 1)" class="group">
		<template #header-extra>
			时间片: {{ Math.pow(2, props.num) * store.global.timeSlice }}
		</template>
		<TransitionGroup name="fade" class="container">
			<Progress
				v-for="item in store.queue[props.num]"
				:key="item.id"
				:p="item"
			>
				<template #close>
					<n-button text @click="store.delete(props.num, item.id)">
						<template #icon>
							<n-icon>
								<close />
							</n-icon>
						</template>
					</n-button>
				</template>
			</Progress>
		</TransitionGroup>
	</n-card>
</template>

<script setup lang="ts">
	import { Close } from '@vicons/ionicons5'
	import { NButton, NIcon, NCard } from 'naive-ui'
	import { useStore } from '@/pinia'
	import Progress from './Progress.vue'
	const store = useStore()
	const props = defineProps<{
		num: number
	}>()
</script>

<style lang="scss" scoped>
	.group {
		position: relative;
		overflow: auto;
		height: 250px;
		width: 33%;
		min-width: 290px;
		.container {
			margin: 15px;
			position: relative;
			width: 100%;
			padding: 0;
		}

		/* 1. 声明过渡效果 */
		.fade-move,
		.fade-enter-active,
		.fade-leave-active {
			transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
		}

		/* 2. 声明进入和离开的状态 */
		.fade-enter-from,
		.fade-leave-to {
			opacity: 0;
		}
	}
</style>
