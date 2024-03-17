<template>
	<div class="progress">
		<div class="title" v-if="props.ishidden">
			{{ com }}
		</div>
		<n-progress
			type="line"
			:percentage="Math.floor((props.p.done / props.p.total) * 100)"
			:color="props.p.color"
		>
			<slot name="close"></slot>
		</n-progress>
	</div>
</template>

<script setup lang="ts">
	import { NProgress } from 'naive-ui'
	import { computed } from 'vue'
	// 控制进度条信息显示
	const props = withDefaults(
		defineProps<{
			p: Progress
			ishidden?: boolean
		}>(),
		{ ishidden: true },
	)
	// 控制精度显示
	const deal = (value: number) => {
		if (Number(value) === Math.round(value)) return value
		if (Number(value * 10) === Math.round(value * 10))
			return value.toFixed(1)
		return value.toFixed(2)
	}
	// 控制标题显示
	const com = computed(() => {
		const s = deal(props.p.done) + '/' + deal(props.p.total)
		return props.p.title ? props.p.title + ' (' + s + ')' : s
	})
</script>

<style lang="scss" scoped>
	.progress {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-flow: column;
		margin: 1em 0;
		.title {
			line-height: 1em;
		}
	}
</style>
