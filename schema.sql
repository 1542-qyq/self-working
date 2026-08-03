-- ============================================================
-- 喵喵编辑部 · 猫咪生活报  Supabase 数据库 Schema
-- 使用方法：
--   1. 登录 https://supabase.com
--   2. 创建新项目（免费套餐即可）
--   3. 进入 SQL Editor，新建 Query
--   4. 粘贴本文件内容并执行
--   5. 复制 Project Settings -> API 中的 URL 和 anon public key
--   6. 在工作台页面点击 "设置" 按钮填入凭据
-- ============================================================

-- 创建存储用户数据的表
CREATE TABLE IF NOT EXISTS public.workbench_data (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 开启行级安全（RLS）
ALTER TABLE public.workbench_data ENABLE ROW LEVEL SECURITY;

-- 创建策略：任何人都可以读取和更新数据（单用户场景简化版）
-- 如需多用户隔离，可增加 user_id 字段并使用 auth.uid() 过滤
DROP POLICY IF EXISTS "允许所有人读取" ON public.workbench_data;
CREATE POLICY "允许所有人读取"
  ON public.workbench_data FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "允许所有人插入更新" ON public.workbench_data;
CREATE POLICY "允许所有人插入更新"
  ON public.workbench_data FOR ALL
  USING (true)
  WITH CHECK (true);

-- 可选：如果需要认证，取消以下注释并移除上面的策略
-- CREATE POLICY "仅认证用户可访问"
--   ON public.workbench_data FOR ALL
--   USING (auth.uid() IS NOT NULL)
--   WITH CHECK (auth.uid() IS NOT NULL);