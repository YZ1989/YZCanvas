import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Download, Plus, Search, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CanvasDeleteProjectsDialog } from "@/components/canvas/canvas-delete-projects-dialog";
import { CanvasProjectCard } from "@/components/canvas/canvas-project-card";
import { exportCanvasProjects } from "@/lib/canvas/canvas-export";
import { latestCanvasProjectId, sortCanvasProjectsByRecent } from "@/lib/canvas/canvas-home";
import { useCanvasStore } from "@/stores/canvas/use-canvas-store";
import { useCanvasUiStore } from "@/stores/canvas/use-canvas-ui-store";

export default function CanvasPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const autoOpenRef = useRef(false);
    const hydrated = useCanvasStore((state) => state.hydrated);
    const projects = useCanvasStore((state) => state.projects);
    const createProject = useCanvasStore((state) => state.createProject);
    const selectedIds = useCanvasUiStore((state) => state.selectedProjectIds);
    const setDeleteIds = useCanvasUiStore((state) => state.setDeleteProjectIds);
    const [search, setSearch] = useState("");
    const sortedProjects = useMemo(() => sortCanvasProjectsByRecent(projects), [projects]);
    const visibleProjects = sortedProjects.filter((project) => project.title.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
    const mode = searchParams.get("mode");
    const agentMode = mode === "new" || mode === "recent" || mode === "choose";
    const agentQuery = agentMode ? `?${searchParams.toString()}` : "";
    const enterProject = (id: string) => navigate(`/canvas/${id}${agentQuery}`);
    const createAndEnter = () => enterProject(createProject(t("canvas.defaultTitle", { count: projects.length + 1 })));

    useEffect(() => {
        if (!hydrated || autoOpenRef.current || (mode !== "new" && mode !== "recent")) return;
        autoOpenRef.current = true;
        const targetId = mode === "new" ? createProject(t("canvas.defaultTitle", { count: projects.length + 1 })) : latestCanvasProjectId(projects) || createProject(t("canvas.defaultTitle", { count: projects.length + 1 }));
        enterProject(targetId);
    }, [createProject, hydrated, mode, projects, t]);

    if (hydrated && (mode === "new" || mode === "recent"))
        return (
            <main className="grid h-full place-items-center text-sm" role="status">
                {t("canvas.opening")}
            </main>
        );

    return (
        <main data-canvas-home className="yz-home">
            <section className="yz-home-hero" aria-labelledby="workspace-heading">
                <img className="yz-home-art" src="/brand/workspace-hero.webp" alt="" width={1000} height={500} fetchPriority="high" />
                <div className="yz-home-hero-copy">
                    <h1 id="workspace-heading">
                        保持好奇，
                        <br />
                        让创作多一点<span>好玩。</span>
                    </h1>
                    <p>从一张画布开始，把好想法变成作品。</p>
                    <button type="button" className="yz-create-button" onClick={createAndEnter} disabled={!hydrated}>
                        <Plus size={22} />
                        <span>新建画布</span>
                        <ArrowUpRight size={18} />
                    </button>
                </div>
            </section>
            <section className="yz-home-projects" aria-labelledby="my-canvases-heading">
                <div className="yz-projects-heading">
                    <div className="yz-projects-title">
                        <h2 id="my-canvases-heading">我的画布</h2>
                        <span>{hydrated ? `${projects.length} 个画布` : "正在加载…"}</span>
                    </div>
                    <div className="yz-project-search">
                        <Search size={18} aria-hidden="true" />
                        <input type="search" placeholder="搜索画布…" aria-label="搜索画布" value={search} onChange={(event) => setSearch(event.target.value)} />
                        {search ? (
                            <button type="button" aria-label="清空搜索" onClick={() => setSearch("")}>
                                <X size={16} />
                            </button>
                        ) : null}
                    </div>
                </div>
                {selectedIds.length ? (
                    <div className="yz-project-selection">
                        <span>已选择 {selectedIds.length} 个画布</span>
                        <button
                            type="button"
                            onClick={() =>
                                void exportCanvasProjects(
                                    projects.filter((project) => selectedIds.includes(project.id)),
                                    `YZCanvas-${selectedIds.length}`,
                                )
                            }
                        >
                            <Download size={15} />
                            导出
                        </button>
                        <button type="button" onClick={() => setDeleteIds(selectedIds)}>
                            <Trash2 size={15} />
                            删除
                        </button>
                    </div>
                ) : null}
                {!hydrated ? (
                    <div className="yz-project-grid" aria-label="正在加载画布">
                        {[0, 1, 2].map((index) => (
                            <div key={index} className="yz-project-skeleton animate-pulse" />
                        ))}
                    </div>
                ) : visibleProjects.length ? (
                    <div className="yz-project-grid">
                        {visibleProjects.map((project) => (
                            <CanvasProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="yz-project-empty">
                        <Search size={28} />
                        <h3>{search ? "没有找到相关画布" : "你的第一张画布，从这里开始"}</h3>
                        <p>{search ? "换个关键词，或清空搜索查看全部画布。" : "连接灵感、图像与视频，开始自由创作。"}</p>
                        <button type="button" onClick={search ? () => setSearch("") : createAndEnter}>
                            {search ? "清空搜索" : "新建画布"}
                            <ArrowUpRight size={16} />
                        </button>
                    </div>
                )}
            </section>
            <CanvasDeleteProjectsDialog />
        </main>
    );
}
