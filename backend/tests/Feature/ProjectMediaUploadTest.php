<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Upload de médias projet (admin) : les images sont ré-encodées en WebP
 * avec vignette, les vidéos sont stockées telles quelles avec type=video
 * et ne sont jamais promues cover.
 */
class ProjectMediaUploadTest extends TestCase
{
    use RefreshDatabase;

    private Project $project;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        config(['filesystems.default' => 'local']);

        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        $category = Category::create([
            'name' => 'Peinture', 'slug' => 'peinture-test', 'order' => 1,
        ]);
        $this->project = Project::create([
            'title' => 'Chantier test', 'category_id' => $category->id, 'status' => 'published',
        ]);
    }

    public function test_image_upload_is_reencoded_with_thumbnail_and_becomes_cover(): void
    {
        $response = $this->postJson("/api/admin/projects/{$this->project->id}/images", [
            'images' => [UploadedFile::fake()->image('salon.jpg', 1600, 1200)],
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.0.type', 'image')
            ->assertJsonPath('data.0.is_cover', true);

        $media = $this->project->images()->first();
        $this->assertStringEndsWith('.webp', $media->path);       // ré-encodé
        $this->assertStringEndsWith('_thumb.webp', $media->thumbnail);
        $this->assertNotNull($media->width);

        $this->assertEquals($media->path, $this->project->fresh()->cover_image);
        $this->assertEquals($media->thumbnail, $this->project->fresh()->cover_thumbnail);
    }

    public function test_video_upload_is_stored_with_video_type_and_never_promoted_cover(): void
    {
        $video = new UploadedFile(
            base_path('tests/fixtures/sample.mp4'),
            'chantier.mp4',
            'video/mp4',
            null,
            true,
        );

        $response = $this->postJson("/api/admin/projects/{$this->project->id}/images", [
            'images' => [$video],
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.0.type', 'video')
            ->assertJsonPath('data.0.is_cover', false);

        $media = $this->project->images()->first();
        $this->assertEquals('video', $media->type);
        $this->assertNull($media->thumbnail);

        // Une vidéo seule ne devient jamais la cover du projet
        $this->assertNull($this->project->fresh()->cover_image);
    }

    public function test_non_media_file_is_rejected(): void
    {
        $response = $this->postJson("/api/admin/projects/{$this->project->id}/images", [
            'images' => [UploadedFile::fake()->create('malware.pdf', 100, 'application/pdf')],
        ]);

        $response->assertUnprocessable();
        $this->assertEquals(0, $this->project->images()->count());
    }
}
