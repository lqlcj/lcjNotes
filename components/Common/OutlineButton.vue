<!--
  通用边框按钮组件
  
  功能：简洁的边框样式按钮，符合页面主题风格
  
  使用示例：
  <OutlineButton @click="handleClick">
    <template #icon>+</template>
    申请友链
  </OutlineButton>
  
  <OutlineButton @click="handleClick" icon="→">
    查看更多
  </OutlineButton>
  
  Props:
  - icon: 图标内容（可选，也可以通过 slot 传入）
  - size: 按钮尺寸 'small' | 'medium' | 'large' (默认 'medium')
  - disabled: 是否禁用
-->

<template>
  <button :class="['outline-btn', `size-${size}`, { disabled: disabled }]" :disabled="disabled"
    @click="$emit('click', $event)">
    <span v-if="icon || $slots.icon" class="btn-icon">
      <slot name="icon">{{ icon }}</slot>
    </span>
    <span class="btn-text">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
  defineProps({
    icon: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  })

  defineEmits(['click'])
</script>

<style scoped>
  .outline-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 20px;
    background: transparent;
    border: 1px solid #d4c5b0;
    color: #68525B;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    line-height: 1.4;
  }

  .outline-btn:hover:not(.disabled) {
    background: rgba(212, 197, 176, 0.1);
    border-color: #c4b5a0;
    color: #2c3e50;
    transform: translateY(-1px);
  }

  .outline-btn:active:not(.disabled) {
    transform: translateY(0);
  }

  .outline-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-icon {
    font-size: 1rem;
    font-weight: 300;
    line-height: 1;
    display: inline-flex;
    align-items: center;
  }

  .btn-text {
    font-weight: 400;
  }

  /* 尺寸变体 */
  .size-small {
    padding: 6px 16px;
    font-size: 0.8rem;
    gap: 5px;
  }

  .size-small .btn-icon {
    font-size: 0.9rem;
  }

  .size-medium {
    padding: 8px 20px;
    font-size: 0.85rem;
    gap: 6px;
  }

  .size-large {
    padding: 10px 24px;
    font-size: 0.95rem;
    gap: 8px;
  }

  .size-large .btn-icon {
    font-size: 1.1rem;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .outline-btn {
      padding: 6px 16px;
      font-size: 0.8rem;
    }

    .btn-icon {
      font-size: 0.9rem;
    }
  }
</style>
